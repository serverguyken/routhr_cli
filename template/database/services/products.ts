
import { ProductsRepository } from "../../database/repository";
import { IProduct } from "../../interface";

export default class ProductsService {
    productsRepository: ProductsRepository;
    constructor() {
        this.productsRepository = new ProductsRepository();
    }
    async FindProductById(id: string): Promise<IProduct> {
        return this.productsRepository.FindProductById(id);
    }
}