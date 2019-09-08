import ScrollBar from './src/scroll-bar.vue';

(ScrollBar as any).install = (Vue: any) => {
    Vue.component(ScrollBar.name, ScrollBar);
}

export default ScrollBar;