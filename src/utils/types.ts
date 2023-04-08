export type Menu = {
    id: string,
    date: string,
    status: string
}

export type MenuItem = {
    name: string
    price: number
    stock: number
    menuId?: string
    id?: string
    quantity?: number
    subtotal?: number
}