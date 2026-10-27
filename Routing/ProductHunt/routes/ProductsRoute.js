import express from "express";
import { about, getAllProducts, getPaginatedProducts, SearchProduct, getproductById } from "../controllers/productController.js";

 export const ProductRouter = express.Router();

ProductRouter.get("/", getAllProducts );
ProductRouter.get("/about",about );
ProductRouter.get("/paginated", getPaginatedProducts);
ProductRouter.get("/search", SearchProduct);
ProductRouter.get("/:id", getproductById);