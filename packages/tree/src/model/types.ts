export interface NodeData {
    label: string
    children?: NodeData[]
    id?: string
    pId?: string
    isLeaf?: boolean
}

export interface TreeProps {
    label: string
    children: string
    disabled?: boolean
    isLeaf?: boolean
}

export interface StoreProps {
    props: TreeProps
    nodeKey: string
    defaultExpandLevel: number
    simple: boolean
    lazy: boolean
    load: Function
    filterNodeMethod?: Function
}
