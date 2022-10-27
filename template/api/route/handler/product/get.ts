import Routhr, { RequestInterface, ResponseInterface, createStatus, createResponse } from "routhr";
import { ProductsService } from "../../../../database/services";

interface Product {
    id: string;
    name: string;
    price: number;
}

const prodHandler = async (req: RequestInterface, res: ResponseInterface) => {
    const prodID = req.params.prodID as string;
    const service = new ProductsService();
    const product = await service.FindProductById(prodID);
    const status = createStatus(200, 0, `Product with id ${prodID} found.`);
    const response = createResponse(status, product);
    res.status(200).json(response);
};

export default prodHandler;