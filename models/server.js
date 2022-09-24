import express from "express";
import cors from "cors";
import "dotenv/config";
import fileUpload from "express-fileupload"

import { routerUsuario } from "../routes/usuarios.js";
import { routerAuth } from "../routes/auth.js"
import { routerCategorias } from "../routes/categorias.js";
import { routerProductos } from "../routes/productos.js";
import { routerBuscar } from "../routes/buscar.js";
import { dbConnection } from "../database/configdb.js";
import { validarJSON } from "../middlewares/validarJson.js";
import { routerUploads } from "../routes/uploads.js";



class Server {

    app;
    port;

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: "/api/auth",
            usuarios: "/api/usuarios",
            categorias: "/api/categorias",
            productos: "/api/productos",
            buscar: "/api/buscar",
            uploads: "/api/uploads"
        }

        this.conectarDb();

        this.middlewares();

        this.routes();
    }

    async conectarDb() {
        await dbConnection();
    }

    middlewares() {


        this.app.use(cors())


        this.app.use(express.json())

        //evitar que la aplicación se detenga al encontrar un json
        //malformado en el body al recibir una peticición post
        this.app.use(validarJSON)


        this.app.use(express.static("public"));


        //FileUpload - Carga de Archivos(cualquier tipo de archivo)
        //con el createParentPath para crear carpetas(por defecto esta en false)
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {

        this.app.use(this.paths.usuarios, routerUsuario);
        this.app.use(this.paths.auth, routerAuth)
        this.app.use(this.paths.categorias, routerCategorias);
        this.app.use(this.paths.productos, routerProductos);
        this.app.use(this.paths.buscar, routerBuscar)
        this.app.use(this.paths.uploads, routerUploads)

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        })
    }
}


export {
    Server
}