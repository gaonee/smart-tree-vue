import Tree from '../packages/tree/index'
import ScrollBar from '../packages/scroll-bar/index'

const components = [
    {name: 'SmartTree', component: Tree},
    {name: 'SmartScrollbar', component: ScrollBar}
]

const install = function(Vue: any) {
    components.forEach(c => {
        Vue.component(c.name, c.component);
    });
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    version: '1.1.5',
    install,
    Tree,
    ScrollBar
}
