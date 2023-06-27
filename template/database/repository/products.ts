

import { IProduct } from "../../interface";
import { products } from "../../database/";

export default class ProductsRepository {
    async AddProduct(product: IProduct): Promise<IProduct> {
        products.push(product);
        return product;
    }
    async FindProductById(id: string): Promise<IProduct> {
        const product = products.find(prod => prod.id === id);
        return product as IProduct;
    }

    async GetAllProducts(): Promise<IProduct[]> {
        return products;
    }
}