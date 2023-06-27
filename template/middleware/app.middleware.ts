import { NextFunctionInterface, RequestInterface, ResponseInterface } from "routhr/interface";


const RouteMiddleware = (req: RequestInterface, res: ResponseInterface, next: NextFunctionInterface) => {
  console.log('Middleware for all routes');
  next();
}

const CreateProductsMiddleware = (req: RequestInterface, res: ResponseInterface, next: NextFunctionInterface) => {
  console.log('Products middleware');
  next();
}



export { RouteMiddleware, CreateProductsMiddleware };