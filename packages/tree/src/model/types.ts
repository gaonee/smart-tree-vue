export interface NodeData {
    label: string
    children?: NodeData[]
    id?: string
    pId?: string
}

export interface TreeProps {
    label: string
    children: string
}

export interface StoreProps {
    props: TreeProps
    nodeKey: string
    defaultExpandLevel: number
    simple: boolean
    filterNodeMethod?: Function
}
