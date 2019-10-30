<template>
    <div class='smart-tree' ref='view'>
        <div class="st-tree-empty-block" v-if="isEmpty">
            <span class="st-tree-empty-text">{{ emptyText }}</span>
        </div>
        <scroll-bar @scroll-changed='handleScroll' :deltaY='deltaY'>
            <div class='st-tree-wrap' :style='{"height": totalHeight + "px"}'>
                <tree-node 
                    v-for='item in displayNodes'
                    v-bind:key='item.id' 
                    :data='item.data'
                    :node='item'
                    :indent='indent'
                    :top='nodeTop'
                    :height='nodeHeight'
                    :label='labelProp'>
                </tree-node>
            </div>
        </scroll-bar>
    </div>
</template>

<script lang='tsx'>
import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import { NodeData, TreeProps, StoreProps } from './model/types';
import Store from './model/store';
import Node from './model/node';
import TreeNode from './tree-node.vue';
import ScrollBar from '../../scroll-bar/index';
import './model/drag'

let defaultProps: TreeProps = {
    children: 'children',
    label: 'label'
}

@Component({
    components: {
        ScrollBar,
        TreeNode
    }
})
export default class StTree extends Vue {
    name: string = 'SmartTree'
    @Prop() readonly data !: NodeData[]
    @Prop({default: () => defaultProps}) readonly props !: TreeProps
    @Prop({default: 90}) readonly deltaY !: number
    @Prop({default: -1}) readonly defaultExpandLevel !: number
    @Prop({default: 10}) readonly indent !: number
    @Prop({default: 30}) readonly nodeHeight !: number
    @Prop({default: '暂无数据！'}) readonly emptyText !: string
    @Prop({default: 'sid'}) readonly nodeKye !: string
    @Prop({default: false}) readonly simple !: boolean
    @Prop({default: false}) readonly draggable !: boolean
    @Prop({default: null}) readonly filterNodeMethod !: Function
    @Prop({default: null}) readonly load !: Function
    @Prop({default: null}) readonly dragProxy !: HTMLElement
    @Prop({default: null}) readonly dragOffset !: any
    @Prop({default: false}) readonly lazy !: boolean
    
    @Ref('view') readonly view !: HTMLElement

    private scrollTop: number = 0;
    private nodeTop: number = 0;
    private totalHeight: number = 0;
    private expandedNodes: Node[] = [];
    private displayNodes: Node[] = [];
    private labelProp: string = 'label';
    private store: Store = new Store(this.data, {
        props: this.props,
        nodeKey: this.nodeKye,
        defaultExpandLevel: this.defaultExpandLevel,
        // vue-property-decorator issue when used like: <st-tree simple></st-tree>
        simple: this.simple !== false,
        lazy: this.lazy !== false,
        load: this.load
    });
    private filterText: string = '';

    get isEmpty() {
        const value: boolean = this.expandedNodes.length == 0;
        if (value) {
            this.scrollTop = 0;
        }
        return value;
    }

    protected created() {
        this.expandedNodes = this.store.getExpandedNodes();
        this.labelProp = this.store.getProps('label');
        this.calculateHeight();
    }

    protected mounted() {
        this.getDisplayNodes();
    }

    private calculateHeight() {
        this.totalHeight = this.expandedNodes.length * this.nodeHeight;
    }

    private getDisplayNodes() {
        const startNodeIndex = Math.floor(this.scrollTop / this.nodeHeight);
        const count = this.view.clientHeight / this.nodeHeight;
        const baseTop = startNodeIndex * this.nodeHeight;

        this.nodeTop = startNodeIndex * this.nodeHeight;
        this.displayNodes = this.expandedNodes.slice(startNodeIndex, startNodeIndex+count+1);
    }

    private handleScroll(top: number) {
        if (top == this.scrollTop) return;

        this.scrollTop = top;
        this.getDisplayNodes();

        /*
        * Because of the node element changed by update, not recreate. so the seletion state will be reserved.
        * And it will turn to other node, so we need to remove seletion state.
        */
        if (top > 0 && window && window.getSelection) {
            /* This operate has a issue like: when filter the tree, input element may blur. */
            const seletion: any = window.getSelection();
            seletion && seletion.removeAllRanges();
        }
    }

    private filterCompare(node: Node) {
        const value: string = this.filterText;

        if (this.filterNodeMethod) {
            return this.filterNodeMethod(value, node.data, node);
        } else {
            const label: string = this.store.getProps('label');
            const content: string = (node.data as any)[label];

            return content ? content.indexOf(value) !== -1 : false;
        }
    }

    public updateExpandedNodes() {
        this.expandedNodes = this.store.getExpandedNodes();
        this.calculateHeight();
        this.getDisplayNodes();
    }

    public updateSize() {
        this.updateExpandedNodes();
    }

    public filter(value: string) {
        this.filterText = value;
        
        this.store.filter(value ? this.filterCompare : undefined);
        this.updateExpandedNodes()
    }
}
</script>

<style scoped>
.smart-tree {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: left;
    color: #000000;
    background: #ffffff;
}
.smart-tree .st-tree-empty-block {
    position: absolute;
    width: 100%;
    text-align: center;
}
</style>
