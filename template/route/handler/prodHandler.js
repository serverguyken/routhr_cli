"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prodHandler = (req, res) => {
    const prodID = req.query.prodID;
    const product = {
        prodId: prodID,
        prodName: "Product Name",
        prodPrice: 100,
    };
    res.status(200).json(product);
};
exports.default = prodHandler;
