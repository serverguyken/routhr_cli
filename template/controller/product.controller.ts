import { RequestInterface, NextFunctionInterface, ResponseInterface } from "routhr/interface";
import { Delete, Get, Middleware, Post, Route } from "routhr/decorators";
import { RouteMiddleware, CreateProductsMiddleware } from "../middleware/app.middleware"



@Route('products', {
    middleware: RouteMiddleware
})
export default class ProductsController {
    prefix: string;
    constructor() {
        this.prefix = '/test';
    }

    @Get()
    getAllProducts(req: RequestInterface, res: ResponseInterface) {
        res.send('All products');
    }

    @Post('create', {
        middleware: CreateProductsMiddleware
    })
    createProduct(req: RequestInterface, res: ResponseInterface) {
        res.send('Create product');
    }

    @Delete(':id')
    deleteProduct(req: RequestInterface, res: ResponseInterface) {
        res.send(`Delete product with id ${req.params.id}`);
    }

}