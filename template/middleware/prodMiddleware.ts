import { RequestInterface, ResponseInterface, NextFunctionInterface } from "routhr";
interface RequestI extends RequestInterface {
    prodID?: string;
}
const prodMiddleware = (req: RequestI, res: ResponseInterface, next: NextFunctionInterface) => {
    // Check if a prodId query parameter is provided
    const prodID: any = req.query.prodID;
    if (!prodID || prodID === "") {
        res.status(400).send({
            message: "Missing prodID parameter.",
        });
    }

    else {
        req.prodID = prodID;
        next();
    }
};

export default prodMiddleware;