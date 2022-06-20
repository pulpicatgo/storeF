export interface Product {
    productId: string;
    nombreProd?: string;
    marca?: string;
    precio?: number;
    categorias? : string[];
    imageUrl?: string;
    cantidad?: number;
}