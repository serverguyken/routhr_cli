import Routhr, { RequestInterface, ResponseInterface } from "routhr";

interface Product {
    prodId: string;
    prodName: string;
    prodPrice: number;
}

const prodHandler = (req: RequestInterface, res: ResponseInterface) => {
    const prodID = req.query.prodID as string;
    const product: Product = {
        prodId: prodID,
        prodName: "Product Name",
        prodPrice: 100,
    };
    res.status(200).json(product);
};

export default prodHandler;