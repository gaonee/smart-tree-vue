<template>
    <div :class='[viewClass, "st-scrollbar"]' :style='viewStyles' @mousewheel='handleMouseWheel' ref='view'>
        <div :class='[wrapClass, "st-scrollbar-wrap"]' :style='wrapStyles' ref='wrap'>
            <slot><span >Sliderbar is empty!</span></slot>
        </div>
        <vertical-bar
            :visiable='isVertical'
            :top.sync='barTop'
            :height='barHeight'
            @update:top='updateTop'>
        </vertical-bar>
    </div>
</template>

<script lang='tsx'>
import { Component, Prop, Vue, Ref, Emit, Watch } from 'vue-property-decorator';
import VerticalBar from './vertical-bar.vue';

@Component({
    components: {
        VerticalBar
    }
})
export default class StScrollbar extends Vue {
    name: string = 'StScrollbar'
    @Prop({default: 90}) readonly deltaY !: number
    @Prop({default: () => {return {}}}) readonly wrapStyle !: any
    @Prop({default: ''}) readonly wrapClass !: string
    @Prop({default: ''}) readonly viewClass !: string
    @Prop({default: () => {return {}}}) readonly viewStyle !: any

    @Ref('view') readonly view !: HTMLElement
    @Ref('wrap') readonly wrap !: HTMLElement

    private readonly minHeight: number = 20;

    private isVertical: boolean = false;
    /* content scroll top */
    private scrollTop: number = 0;
    private barTop: number = 0;
    private barHeight: number = 0;

    get wrapStyles() {
        this.wrapStyle['margin-top'] = -this.scrollTop + 'px';
        return this.wrapStyle;
    }
    
    get viewStyles() {
        return this.viewStyle;
    }

    mounted() {
        this.update()
    }

    updated() {
        this.update()
    }

    handleMouseWheel(e: any) {
        if (!this.isVertical) return;

        const scrollTop: number =  this.scrollTop + (e.deltaY > 0 ? this.deltaY : -this.deltaY)

        if (this.setScrollTop(scrollTop)) {
            e.preventDefault()
        }

        return false
    }

    setScrollTop(scrollTop: number): boolean {
        const orignTop = this.scrollTop
        const maxTop = Math.max(this.wrap.clientHeight - this.view.clientHeight, 0)

        scrollTop = Math.max(scrollTop, 0)
        scrollTop = Math.min(scrollTop, maxTop)

        if (scrollTop != orignTop) {
            this.scrollTop = scrollTop
            this.barTop = (this.scrollTop / (this.wrap.clientHeight - this.view.clientHeight)) * (this.view.clientHeight - this.barHeight)

            this.scrollChanged()
            return true
        }

        return false
    }

    update() {
        const isVertical: boolean = this.wrap.clientHeight > this.view.clientHeight;
        
        if (this.isVertical != isVertical) {
            this.isVertical = isVertical;
        }

        if (this.isVertical) {
            const maxScrollTop: number = this.wrap.clientHeight - this.view.clientHeight;
            let height: number = this.view.clientHeight / this.wrap.clientHeight * this.view.clientHeight;
            height = Math.max(height, this.minHeight);

            if (this.barHeight != height) {
                this.barHeight = height;
            }

            if (this.scrollTop > maxScrollTop) {
                this.setScrollTop(maxScrollTop);
            }
        } else {
            if (this.scrollTop != 0) {
                this.setScrollTop(0);
            }
        }
    }

    updateTop(top: number) {
        const percentage: number = top / (this.view.clientHeight - this.barHeight);
        const scrollTop: number = (this.wrap.clientHeight - this.view.clientHeight) * percentage;

        this.setScrollTop(scrollTop);
        this.scrollChanged();
    }

    @Emit()
    scrollChanged() {
        return Math.abs(this.scrollTop);
    }
}
</script>

<style scoped>
.st-scrollbar {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
}
</style>
