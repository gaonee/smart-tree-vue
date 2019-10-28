<template>
    <div :class='[{"is-current": node.isCurrent}, "st-tree-node"]'
    :style='{"height": height + "px","top": top + "px"}'
    :draggable='tree.draggable'
    v-stdrag='dragData'
    @dragstart.stop='handleDragStart'
    @dragover.stop='handleDragOver'
    @dragend.stop='handleDragEnd'
    @click="handleClick">
        <div class='node-wrap' :style='{"line-height": height + "px", "margin-left": (node.level*indent) + "px"}'>
            <span :class='[{
                "leaf": node.isLeaf,
                "expanded": !node.isLeaf && node.expanded,
                "click-expanded": !node.isLeaf && clickExpand
            }, "node-switch"]'></span>
            <node-content :data='data' :label='label'></node-content>
        </div>
    </div>
</template>

<script lang='tsx'>
import { Component, Prop, Emit, Vue, Watch } from 'vue-property-decorator';
import { NodeData, TreeProps } from './model/types';
import Node from './model/node';
import './model/drag'

@Component({
    components: {
        NodeContent: {
            props: {
                data: null,
                label: null
            },
            render(h: any) {
                const parent: any = this.$parent;
                const tree: any = parent.$parent.$parent;
                const node: Node = parent.node;
                const { store, data } = node;
                const label: string = (this as any).label;
                const renderProxy: any = (parent as any)._renderProxy;

                return (parent.renderContent 
                    ? parent.renderContent.call(renderProxy, h, {_self: tree.$vnode.context, node, data, store}) 
                    : tree.$scopedSlots.default
                        ? tree.$scopedSlots.default({node, data})
                        : <span class='node-content'>{ (data as any)[label] }</span>);
            }
        }
    }
})
export default class TreeNode extends Vue {
    name: string = 'tree-node'
    @Prop() readonly data !: NodeData
    @Prop({default: () => null}) readonly node !: Node
    @Prop({default: 10}) readonly indent !: number
    @Prop({default: 0}) readonly top !: number
    @Prop({default: 0}) readonly height !: number
    @Prop({default: 'label'}) readonly label !: string

    private clickExpand: boolean = false;
    private tree: any;

    created() {
        this.tree = this.$parent.$parent;
    }

    get dragData() {
        const component: any = this.tree.dragProxy ? this.tree.dragProxy(this.data, this.node) : null;

        return component ? {
            component: component,
            offset: this.tree.dragOffset
        } : null;
    }

    private handleDragStart(e: any) {
        if (this.tree.draggable === false) return;

        if (this.tree.dragProxy) {
            e.preventDefault();
        }

        this.tree.$emit('tree-node-drag-start', e, this);
    }

    private handleDragOver(e: any) {
        if (this.tree.draggable === false) return;

        this.tree.$emit('tree-node-drag-over', e, this);
        e.preventDefault();
    }

    private handleDragEnd(e: any) {
        if (this.tree.draggable === false) return;

        this.tree.$emit('tree-node-drag-end', e, this);
    }

    private handleClick() {
        const tree: any = this.tree;

        tree.$emit('current-change', this.node.data, this.node, this);

        if (this.node.expanded) {
            tree.$emit('node-collapse', this.node.data, this.node, this);
            this.node.expanded = false;
        } else {
            this.node.expanded = true;
            tree.$emit('node-collapse', this.node.data, this.node, this);
        }

        /* When the tree scrolling, attribute will update, and tree node-switch animation
         * will display,we only display it when expanded by click, not by update.
         */
        this.clickExpand = true;
        setTimeout(() => {this.clickExpand = false;}, 300);

        tree.store.setCurrentNode(this.node);
        tree.updateExpandedNodes();
        tree.$emit('node-click', this.node.data, this.node, this);
    }
}
</script>

<style scoped>
.st-tree-node {
    position: relative;
    width: 100%;
    height: 100%;
}
.st-tree-node.is-current,
.st-tree-node:hover {
    background-color: #41aee3;
}

.st-tree-node .node-wrap {
    position: relative;
    height: 100%;
}
.st-tree-node .node-wrap span {
    display: inline-block;
}
.st-tree-node .node-wrap .node-switch {
    color: #005591;
    margin: 3px;
    border-top-width: 4px;
    border-bottom-width: 4px;
    border-left-width: 5px;
    border-right-width: 0px; 
    border-style: solid;
    border-color: transparent transparent transparent #005591;
}
.st-tree-node .node-wrap .node-switch.expanded {
    transform:translate(0px, 2px) rotate(90deg);
    -ms-transform:translate(0px, 2px) rotate(90deg);
    -moz-transform:translate(0px, 2px) rotate(90deg);
    -webkit-transform:translate(0px, 2px) rotate(90deg);
    -o-transform:translate(0px, 2px) rotate(90deg);
}
/* .st-tree-node .node-wrap .node-switch.click-expanded {
    transition:all 0.3s ease-in-out;
    -ms-transform:all 0.3s ease-in-out;
    -moz-transform:all 0.3s ease-in-out;
    -webkit-transform:all 0.3s ease-in-out;
    -o-transform:all 0.3s ease-in-out;
} */
.st-tree-node .node-wrap .node-switch.leaf {
    border-width: 0;
    width: 5px;
    height: 8px;
    color: transparent;
}
</style>
