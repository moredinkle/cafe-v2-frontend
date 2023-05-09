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
  sold: number,
  subtotal: number,
}

export function toReportRow(item: any){
  return {
    id: item.id,
    name: item.name,
    price: parseFloat(item.price as unknown as string),
    subtotal: parseFloat(item.subtotal as unknown as string),
    sold: parseInt(item.sold),
  } as SalesReportRow;
}

