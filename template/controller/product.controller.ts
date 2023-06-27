import { RequestInterface, NextFunctionInterface, ResponseInterface } from "routhr/interface";
import { Delete, Get, Middleware, Post, Route } from "routhr/decorators";
import { RouteMiddleware, CreateProductsMiddleware } from "../middleware/product.middleware"



@Route('products', {
    middleware: RouteMiddleware
})
export default class ProductsController {
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