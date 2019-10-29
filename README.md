# smart-tree

## License

MIT License

## Install
```
npm install -S smart-tree
```

## Quick Start
``` javascript
import Vue from 'vue'
import SmartTree from 'smart-tree'
import 'smart-tree/dist/smart-tree.css'

Vue.use(SmartTree)
```

``` html
/**
 * smart-tree组件的容器必须要有固定尺寸，这是因为它需要计算可视区域。
 * The container size of smart-tree component should be affirmatoryly, because we must calculate the size
 * of visiable area.
 */
<app>
    <div style='width:200px;height:100px'>
        <smart-tree></smart-tree>
    </div>
</app>
```
