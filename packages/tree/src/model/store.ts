import { NodeData, TreeProps, StoreProps } from './types';
import Node from './node';

export default class Store {
    public option: StoreProps
    private root: Node;
    private currentNode: Node|null = null;

    constructor(data: NodeData[], option: StoreProps) {
        this.option = option;
        const rootData: NodeData = {
            label: 'root'
        };

        if (option.simple) {
            this.root = new Node(rootData, this);
            this.root.insertSimpleData(data);
        } else {
            const children: string = this.getProps('children');
            
            (rootData as any)[children] = data;
            this.root = new Node(rootData, this);
        }
    }

    /*
     * Get expanded nodes
     */
    public getExpandedNodes(): Node[] {
        return this.root.getExpandedNodes();
    }

    public getProps(prop: string) {
        if (this.option.props) {
            prop = (this.option.props as any)[prop] || prop;
        }
        
        return prop;
    }

    public setCurrentNode(node: Node): void {
        if (this.currentNode != null && this.currentNode != node) {
            this.currentNode.isCurrent = false;
        }

        this.currentNode = node;
        this.currentNode.isCurrent = true;
    }

    public filter(filter?: Function) {
        this.root.filter(filter);
    }
}
