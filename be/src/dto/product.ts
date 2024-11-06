export interface createProductDto {
    productName: string,
    productDesc: string,
    price: number,
    qty: number,
    photo: string,
}
export interface editProductDto {
    id: number,
    productName: string,
    productDesc: string,
    price: number,
    qty: number,
    photo?: string,
}