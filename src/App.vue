<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <span>Search: </span><input v-model='filterText' />
    <SmartTree
      :data='this.data'
      :filter-node-method="filterNode"
      :load='load'
      lazy
      draggable
      ref="tree"></SmartTree>
  </div>
</template>

<script lang="tsx">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import SmartTree from '../packages/tree/src/tree.vue';
import { NodeData } from '../packages/tree/src/model/types';

const treeData: any[] = [];
for (let i = 0; i < 100; i++) {
  treeData.push({
    label: 'item-' + i,
    // children: [{
    //   label: 'item-' + i + '-1'
    // }]
  })
}

const simpleData: any[] = [];
for (let i = 0; i < 100; i++) {
  simpleData.push({
    id: i+1,
    label: 'sitem-' + i
  })
}
for (let i = 0; i < 100; i++) {
  simpleData.push({
    id: 101+i,
    pId: i+1,
    label: 'sitem-' + i + '-1'
  })
}

@Component({
  components: {
    HelloWorld,
    SmartTree
  },
})
export default class App extends Vue {
  @Ref('tree') readonly tree !: any

  @Watch('filterText')
  filter(val: string) {
    this.tree.filter(val);
  }

  private data: any[] = treeData
  private filterText: string = ''

  private filterNode(value: string, data: any) {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
  }

  private load(node: any, resolve: Function) {
    const data: NodeData[] = [];
    resolve(treeData)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 300px;
  height: 500px;
  border: 1px solid lightblue;
}
</style>
