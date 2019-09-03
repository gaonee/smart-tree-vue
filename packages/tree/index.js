import Tree from './src/tree';

Tree.install = Vue => {
    Vue.component(Tree.name, Tree);
}

export default Tree;