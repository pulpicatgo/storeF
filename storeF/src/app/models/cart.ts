export interface Cart {
    cartId: string;
    userId: string;
    productos?: CartItem[];
    totalProductos:number;
}

export interface CartItem {
    productId?: string;
    nombreProd?: string;
    marca?: string;
    precio?: number;
    imageUrl?: string;
    cantidadCompra?: number;
}