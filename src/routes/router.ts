import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, updateAvailability, deleteProduct } from "../handlers/product.";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the product
 *           example: "Laptop"
 *         price:
 *           type: number
 *           description: The price of the product
 *           example: 999.99
 *         availability:
 *           type: boolean
 *           description: The availability status of the product
 *           example: true
 * 
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Product]
 *     description: Retrieve a list of products from the database.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     tags: [Product]
 *     description: Retrieve a single product by its ID from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid ID supplied
 */
router.get('/:id', 
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  handleInputErrors,
  getProductById);



/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     description: Create a new product in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smartphone"
 *               price:
 *                 type: number
 *                 example: 499.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', 
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('price').notEmpty().withMessage('El precio es obligatorio').isFloat({gt:0}).withMessage('El precio debe ser un número mayor a 0'),  
  handleInputErrors,
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Product]
 *     description: Update an existing product in the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smartphone"
 *               price:
 *                 type: number
 *                 example: 499.99
 *               availability:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid input
 */
router.put('/:id', 
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  body('name').notEmpty().withMessage('El nombre no puede estar vacío'),
  body('price').notEmpty().withMessage('El precio no puede estar vacío').isFloat({gt:0}).withMessage('El precio debe ser un número mayor a 0'),
  body('availability').isBoolean().withMessage('La disponibilidad debe ser un valor booleano'),
  handleInputErrors,
  updateProduct
); 




/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product availability
 *     tags: [Product]
 *     description: Update the availability status of a product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid input
 */
router.patch('/:id', 
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  handleInputErrors,
  updateAvailability
)


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product]
 *     description: Delete a product from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid ID supplied
 */
router.delete('/:id', 
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  handleInputErrors,
  deleteProduct
)

export default router;