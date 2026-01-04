import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Product from "../models/Product.model";


export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Product.destroy({
            where: { id }
        });
        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const updateAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.availability = !product.availability;
        await product.save();
        res.json({ data: product });
        
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}


export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Product.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ message: "Product not found" });
        }
        const updatedProduct = await Product.findByPk(id, {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        res.json({ data: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            order: [['id', 'DESC']],
            limit: 10,
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        res.json({ data: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        // Validar los datos de entrada
        await check("name").notEmpty().withMessage("El nombre es obligatorio").run(req);
        await check("price").notEmpty().withMessage("El precio es obligatorio").isFloat({ gt: 0 }).withMessage("El precio debe ser un número mayor a 0").run(req);

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const product = await Product.create(req.body);
        res.status(201).json({ message: "Product created", data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}