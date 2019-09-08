

<script lang='tsx'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NodeData } from './model/types';

@Component
export default class TreeNode extends Vue {
    @Prop() private data !: NodeData
    private name: string = 'smart-tree'

    render() {
        return (
            <div class='tree-node'>
                <h2>{this.data.label}</h2>
            </div>
        )
    }
}
</script>

<style scoped>
.smart-node {
}
</style>