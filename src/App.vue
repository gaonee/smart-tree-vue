<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <SmartTree :data='this.data'></SmartTree>
  </div>
</template>

<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import SmartTree from '../packages/tree/src/tree.vue';

let treeData: any[] = [];
for (let i = 0; i < 100; i++) {
  treeData.push({
    label: 'item-' + i
  })
}

@Component({
  components: {
    HelloWorld,
    SmartTree
  },
})
export default class App extends Vue {
  data: any[] = treeData
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
