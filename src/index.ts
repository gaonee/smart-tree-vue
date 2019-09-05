import Vue, {PluginObject} from 'vue'
import Tree from '../packages/tree/index'

interface Plugin {
    installed: boolean
    version: string
    install: Function
}

let myPlugin: PluginObject<any> = {
    version: '1.0.3',
    install: function(Vue: any) {
        if (this.installed) return;
        Vue.component(Tree.name, Tree)
    }
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
	myPlugin.install((window as any).Vue);
}

Vue.use(myPlugin)

export default myPlugin;