import { NodeData, StoreProps } from './types';
import Store from './store';

export default class Node {
    public expanded: boolean = false;
    public isLeaf: boolean = false;
    public isCurrent: boolean = false;
    public level: number = 0;
    public data: NodeData;
    public parent: Node | undefined;
    public childNodes: Node[] = [];
    public store: Store;
    public visible: boolean = true;
    public loaded: boolean = false;

    constructor(data: NodeData, store: Store, parent?: Node) {
        this.data = data;
        this.store = store;
        this.parent = parent;

        if (!store.option.simple) {
            if (this.store.option.lazy && this.parent) {
                this.expanded = this.data.isLeaf == undefined ? true : this.data.isLeaf;
            } else {
                this.setData();
            }

            this.updateLeafState();
        }
    }

    private setData(): void {
        const children: NodeData[] = this.getChildren();

        for (let i = 0,len = children.length; i < len; i++) {
            this.insertChild(children[i]);
        }
    }

    private insertChild(child: NodeData): void {
        if (!child) throw new Error('insertChild error: child is required.');

        const node: Node = new Node(child, this.store, this);
        node.level = this.level + 1;
        node.expanded = node.level <= this.store.option.defaultExpandLevel;

        this.childNodes.push(node);
    }

    private getChildren(): NodeData[] {
        let children: string = this.store.getProps('children');

        return (this.data as any)[children] || [];
    }

    private getId(): string {
        const id: string = 'id';
        return (this.data as any)[id];
    }

    private getPid(): string {
        const pId: string = 'pId';
        return (this.data as any)[pId];
    }

    private collectExpandedNodes(collection: Node[]) {
        for (let i = 0,len = this.childNodes.length; i < len; i++) {
            const node: Node = this.childNodes[i];

            if (node.visible) {
                collection.push(node);

                if (!node.isLeaf && node.expanded) {
                    node.collectExpandedNodes(collection);
                }
            }
        }
    }

    private formatSimpleData(node: Node) {
        node.childNodes.forEach((child: Node) => {
            child.level = node.level + 1;
            child.expanded = child.level <= this.store.option.defaultExpandLevel;
            child.parent = node;

            if (child.childNodes.length > 0) {
                child.isLeaf = false;
                this.formatSimpleData(child);
            } else {
                child.isLeaf = true;
            }
        })
    }

    private updateLeafState() {
        const lazy: boolean = this.store.option.lazy;
        if (lazy === true && this.loaded !== true) {
            this.isLeaf = this.data.isLeaf == undefined ? true : this.data.isLeaf;
            return;
        }
        const childNodes = this.childNodes;
        if (!lazy || (lazy === true && this.loaded === true)) {
            this.isLeaf = !childNodes || childNodes.length === 0;
            return;
        }
        this.isLeaf = false;
    }

    private loadData(callback: Function) {
        if (this.store.option.lazy && this.store.option.load && !this.loaded) {
            const resolve = (children: NodeData[]) => {
                this.loaded = true;
                this.childNodes = [];

                if (callback) {
                    callback.call(this, children);
                }
            }

            this.store.option.load(this, resolve);
        } else {
            if (callback) {
                callback.call(this);
            }
        }
    }

    public filter(filter?: Function) {
        if (this.isLeaf) {
            this.visible = filter ? filter(this) : true;
        } else {
            for (let i = 0,len = this.childNodes.length; i < len; i++) {
                const node: Node = this.childNodes[i];
                const filterFlag: boolean = filter ? filter(node) : true;

                if (!node.isLeaf) {
                    node.filter(filter);
                } else {
                    node.visible = filterFlag;
                }
            }

            // child nodes has visible node or not.
            this.visible = this.childNodes.some((node: Node) => {
                return node.visible;
            })
            
            // expand node when we filter tree and filter text not empty.
            if (filter && this.visible) {
                this.expanded = true;
            }
        }
    }

    /*
     * Get expanded nodes
     */
    public getExpandedNodes(): Node[] {
        const ret: Node[] = [];
        this.collectExpandedNodes(ret);

        return ret;
    }

    public insertSimpleData(data: NodeData[]) {
        const tempMap: any = {};
        // Object will sort by ASCII code automatically, so we add prefix to prevent the attributes order is changed.
        const prefix: string = 'temp_';

        data.forEach((item: NodeData) => {
            if (!item.id) return;
            tempMap[prefix+item.id] = new Node(item, this.store);
        })

        Object.keys(tempMap).forEach((id: string) => {
            const node: Node = tempMap[id];
            const pId: string = node.getPid();
            const parent: Node = tempMap[prefix+pId];

            if (parent && node !== parent) {
                parent.childNodes.push(node);
            } else {
                this.childNodes.push(node);
            }
        })

        this.formatSimpleData(this);
    }

    public collapse() {
        this.expanded = false;
    }

    public expand() {
        this.expanded = true;

        if (this.store.option.lazy) {
            this.loadData((data: NodeData[]) => {
                console.log(data)
            })
        }
    }
}
