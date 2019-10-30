import ScrollBar from './src/main.vue';

(ScrollBar as any).install = (Vue: any) => {
    Vue.component(ScrollBar.name, ScrollBar);
}

export default ScrollBar;