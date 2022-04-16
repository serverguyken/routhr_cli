"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_version = process.env.API_VERSION || 'api/v1';
const prodHandler_1 = __importDefault(require("./handler/prodHandler"));
const prodMiddleware_1 = __importDefault(require("../middleware/prodMiddleware"));
const routes = [
    {
        path: `/${api_version}/products/lookup`,
        method: 'GET',
        handler: prodHandler_1.default,
        middleware: prodMiddleware_1.default,
    },
];
exports.default = routes;
