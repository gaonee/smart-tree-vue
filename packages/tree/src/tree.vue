

<script lang='tsx'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NodeData } from './model/types';
import TreeNode from './tree-node.vue';

@Component({
    components: {
        TreeNode
    }
})
export default class SmartTree extends Vue {
    @Prop() private data !: NodeData[]
    private name: string = 'smart-tree'

    private handleScroll(e: any) {
        console.log(e.detail)
    }

    render() {
        return (
            <div class='smart-tree' onScroll={this.handleScroll}>
            <div class='tree-wrap'>
            {
                this.data.map(item => {
                    return <TreeNode data={item}></TreeNode>
                })
            }
            </div>
            </div>
        )
    }
}
</script>

<style scoped>
.smart-tree {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
}
</style>