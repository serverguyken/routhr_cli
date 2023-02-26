import Routhr, { RequestInterface, ResponseInterface, createStatus, createResponse } from "routhr";
import services from "../../../service";

interface Product {
    id: string;
    name: string;
    price: number;
}

const prodHandler = async (req: RequestInterface, res: ResponseInterface) => {
    const prodID = req.params.prodID as string;
    const productService = new services.ProductsService();
    const product = await productService.FindProductById(prodID);
    const status = createStatus(200, 0, product ? `Product with id ${prodID} found.` : `Product with id ${prodID} not found.`);
    const response = createResponse(status, product);
    res.status(200).json(response);
};

export default prodHandler;