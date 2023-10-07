import { RequestInterface, NextFunctionInterface, ResponseInterface } from "routhr/interface";
import { Get, Route } from "routhr/decorators";



@Route()
export default class AppController {
    @Get()
    welcome(req: RequestInterface, res: ResponseInterface) {
        res.send('Welcome to your first Routhr app!');
    }

    @Get('about')
    about(req: RequestInterface, res: ResponseInterface) {
        res.send('About page');
    }
}