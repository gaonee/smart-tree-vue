

<script lang='tsx'>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TreeNode extends Vue {
    private name: string = 'scroll-bar'

    render() {
        return (
            <div class='smart-scroll-bar'>
            </div>
        )
    }
}
</script>

<style scoped>
.smart-scroll-bar {
}
</style>