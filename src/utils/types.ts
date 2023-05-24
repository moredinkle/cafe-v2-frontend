export type Menu = {
  id: string;
  date: string;
  status: "INACTIVE" | "ACTIVE" | "FINISHED";
};

export type MenuItem = {
  name: string;
  price: number;
  stock: number;
  menuId?: string;
  id?: string;
  quantity?: number;
  subtotal?: number;
};

export type Order = {
  total: number;
  payedWith: number;
  change: number;
  type: "VENTA" | "SERVIDOR";
  id?: string;
};

export type OrderItem = {
  quantity: number;
  subtotal: number;
  menuItemId: string;
  orderId: string;
  id?: string;
}

export type SalesReportRow = {
  id: string,
  name: string,
  price: number,
  stock: number,
  sold: number,
  subtotal: number,
}

export type MenuExtra = {
  description: string,
  amount: number,
  type: "GASTO" | "INGRESO",
  menuId: string,
  id: string
}

export function toExtra(item: any){
  return {
    description: item.description,
    amount: parseFloat(item.amount),
    type: item.type,
    menuId: item.menuId,
    id: item.id
  } as MenuExtra
}

export function toReportRow(item: any){
  return {
    id: item.id,
    name: item.name,
    price: parseFloat(item.price as unknown as string),
    subtotal: parseFloat(item.subtotal as unknown as string),
    sold: parseInt(item.sold),
    stock: parseInt(item.stock)
  } as SalesReportRow;
}


export function toMenuItem(item: any){
  item.price = parseFloat(item.price as unknown as string);
  return item as MenuItem;
}
