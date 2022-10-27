import { RequestInterface, ResponseInterface, NextFunctionInterface } from "routhr";
interface RequestI extends RequestInterface {
    routhr?: any;
    prodID?: string;
}
const prodMiddleware = (req: RequestI, res: ResponseInterface, next: NextFunctionInterface) => {
    // Check if a prodId query parameter is provided
    const { prodID } = req.routhr?.route.params;
    if (!prodID || prodID === "" || prodID === "undefined" || prodID === "null") {
        res.status(400).send({
            message: "Missing product id",
        });
    }
    else {
        next();
    }
};

export default prodMiddleware;