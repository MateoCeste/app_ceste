import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: "3.0.2",
        tags: [
            {
                name: "Product",
                description: "API Operations related to products"
            }
        ],
        info: {
            title: "REST API Node.js / Express / TypeScript",
            version: "1.0.0", 
            description: "API docs for Products"
        }
    },
    apis: ["./src/routes/*.ts"]
}

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions : SwaggerUiOptions = {
    explorer: true,
    customCss: `
        .topbar-wrapper .link{
            content: url('https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg');
            height: 80px;
            width: auto;

        }
        .swagger-ui .topbar {
            background-color: #000000;
            padding: 10px 20px;
            box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        }
        `,
    customSiteTitle: "Documentacion REST API - Node.js / Express / TypeScript"
};

export default swaggerSpec; 
export { swaggerUiOptions };