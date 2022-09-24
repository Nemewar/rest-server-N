/* Al subir nuestro rest server a heroku
y queremos subir archivos de cualquier formato
no se va a poder porque heroku los borra como medida de seguridad
al detectar un nuevo cambio en el repositorio

para ello debemos utilizar otra alternativa gratuita llamada
CLOUDINARY para guardar archivos*/

import { Router } from "express";
import { body, param } from "express-validator";


import { validarCampos, validarArchivoSubir } from "../middlewares/index.js";
import { actualizarImagen, actualizarImagenCloudinary, cargarArchivo, mostrarImagen } from "../controllers/uploads.js";
import { coleccionesPermitidas } from "../helpers/dbValidators.js";

const routerUploads = Router();


//mostrar imagenes al front
routerUploads.get("/:coleccion/:id",[
    param("id", "El id debe ser de mongo").isMongoId(),
    param("coleccion").custom(c => coleccionesPermitidas(c, ["usuarios", "productos"])),
    validarCampos
],mostrarImagen)

//subir archivos al back
routerUploads.post("/", validarArchivoSubir, cargarArchivo)


//actualizar imagen de un producto o categoria
routerUploads.put("/:coleccion/:id", [
    validarArchivoSubir,
    param("id", "El id debe ser de mongo").isMongoId(),
    param("coleccion").custom(c => coleccionesPermitidas(c, ["usuarios", "productos"])),
    validarCampos
], actualizarImagenCloudinary)
// ], actualizarImagen)



export {
    routerUploads
}