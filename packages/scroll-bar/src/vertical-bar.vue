<template>
    <div class='st-scrollbar-slider-vertical' v-if='visiable' @click='handleClick' ref='view'>
        <div class='st-scrollbar-bar'
            :style='{"height": height + "px","top": top + "px"}' 
            @click='handleBarClick'
            @mousedown='handleMouseDown'>
        </div>
    </div>
</template>

<script lang='ts'>
import { Component, Prop, PropSync, Vue, Ref, Emit, Watch } from 'vue-property-decorator';

@Component
export default class VerticalBar extends Vue {
    name: string = 'VerticalBar';
    @Prop({default: false}) readonly visiable !: boolean;
    @Prop({default: 0}) private top !: number;
    @Prop({default: 0}) readonly height !: number;
    @Ref('view') readonly view !: HTMLElement

    private mouseDownFlag: boolean = false;
    private mouseDownY: number = 0;
    private movingFlag: boolean = false;
    private topBackup: number = 0;

    private handleMouseDown(e: any) {
        this.mouseDownFlag = true
        this.mouseDownY = e.clientY
        this.topBackup = this.top

        document.addEventListener('mousemove', this.handleMouseMove)
        document.addEventListener('mouseup', this.handleMouseUp)
        return false
    }

    private handleMouseMove(e: any) {
        e.preventDefault()

        if (!this.mouseDownFlag ||
            e.buttons != 1 ||
            e.button == 2) {
            return false;
        }

        /* control moving interval */
        if (!this.movingFlag) {
            this.movingFlag = true;

            this.setVerticalBarTop(this.topBackup + e.clientY - this.mouseDownY)
            setTimeout(() => {
                this.movingFlag = false;
            }, 30);
        }
    }

    private handleMouseUp(e: any) {
        this.mouseDownFlag = false

        document.removeEventListener('mousemove', this.handleMouseMove)
        document.removeEventListener('mouseup', this.handleMouseUp)
        return false
    }

    private handleClick(e: any): void {
        this.setVerticalBarTop(e.offsetY - this.height/2);
    }

    private handleBarClick(e: any) {
        e.cancelBubble = true;
        return false;
    }

    private setVerticalBarTop(top: number, notEmit?: boolean) {
        const maxTop = this.view.clientHeight - this.height

        if (top < 0) top = 0
        if (top > maxTop) top = maxTop

        if (this.top != top) {
            !notEmit && this.updateTop(top);
        }
    }

    @Emit('update:top')
    updateTop(top: number) {
        return top;
    }
}
</script>

<style scoped>
.st-scrollbar-slider-vertical {
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 100%;
}
.st-scrollbar-slider-vertical .st-scrollbar-bar {
    position: absolute;
    width: 100%;
    background: #000000;
    border-radius: 4px;
    opacity: 0.2;
}
.st-scrollbar-slider-vertical .st-scrollbar-bar:hover {
    opacity: 0.5;
    transition:all 0.5s ease-in-out;
}
</style>
