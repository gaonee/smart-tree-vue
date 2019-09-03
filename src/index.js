import Vue from 'vue'
import Tree from '../packages/tree/index'

let myPlugin = {
    version: '1.0.3',
    install: function(Vue) {
        if (this.installed) return;
        Vue.component(Tree.name, Tree)
    }
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
	myPlugin.install(window.Vue);
}

Vue.use(myPlugin)

export default myPlugin;