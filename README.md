# smart-tree

这个库的使用方法跟element-ui里面的el-tree组件类似，所以你可以先了解该组件的使用方法，这里主要介绍额外的功能。

This library is used like el-tree from element-ui, so please read its README before using this library. And in this place we olny introduce the diffrence function.

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
 *
 * The container size of smart-tree component should be affirmatoryly, because we must calculate the size
 * of visiable area.
 */
<app>
    <div style='width:200px;height:100px'>
        <smart-tree></smart-tree>
    </div>
</app>
```

## Current Attributes & Functions

### ATTRIBUTES:

data

props

deltaY

defaultExpandLevel

indent

nodeHeight

emptyText

simple

### HOOKS:

filterNodeMethod

### FUNCTIONS:

filter(value: string): void

updateSize(): void

## Usage

There are several attributes:

- [`simple`](#simple)
- [`deltaY`](#deltaY)
- [`nodeHeight`](#nodeHeight)

### <a id="simple"></a> `simple: boolean`

simple一般与data属性配合使用，表示data的结构类型。不携带为false，表示data为树型数据结构（element-ui的结构）；携带时为true，此时data类型为数组，每个元素根据id和pId属性标识树型关系。

The simple attribute generally used with data, it means that data format is a array.

``` javascript
const data = [
    {
        label: 'item1',
        id: 1
    }, {
        label: 'item2',
        id: 2,
        pId: 1
    }, {
        label: 'item3',
        id: 3,
        pId: 2
    }
]
```

相当于

is equivalent to

``` javascript
const data = [
    {
        label: 'item1',
        children: [{
            label: 'item2',
            children: [{
                label: 'item3'
            }]
        }]
    }
]
```

### <a id="deltaY"></a> `deltaY: number`

deltaY表示鼠标滚轮滚动的幅度，单位为像素。

deltaY means mousewheel delta in vertical bar.

### <a id="nodeHeight"></a> `nodeHeight: number`

nodeHeight表示每个树节点的高度。

nodeHeight is heigth of tree node.
