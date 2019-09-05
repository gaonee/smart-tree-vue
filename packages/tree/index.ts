import Tree from './src/tree.vue';

(Tree as any).install = (Vue: any) => {
    Vue.component(Tree.name, Tree);
}

export default Tree;