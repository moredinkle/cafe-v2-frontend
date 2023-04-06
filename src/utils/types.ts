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
}