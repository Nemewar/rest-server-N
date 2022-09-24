import { Router } from "express";
import { body, param, check } from "express-validator";
import { actualizarProducto, borrarProducto, crearProducto, obtenerProducto, obtenerProductos } from "../controllers/productos.js";
import { existeCategoria, existeProducto } from "../helpers/dbValidators.js";
import { tieneRol, validarCampos, validarJWT } from "../middlewares/index.js";


const routerProductos = Router();


routerProductos.get("/", obtenerProductos)

routerProductos.get("/:id", [
    param("id", "no es un id de mongo").isMongoId(),
    param("id").custom(existeProducto),
    validarCampos
], obtenerProducto)


//no es necesario enviar en el body el usuario, porque 
//al validar el jwt guardamos el id de un usuario en la request
//luego al crear el producto usaremos ese id para el usuario
routerProductos.post("/", [
    validarJWT,
    body("nombre", "El nombre es obligatorio").not().isEmpty(),
    body("categoria", "la categoria es obligatoria").not().isEmpty(),
    body("categoria","No es un id de mongo").isMongoId(),
    body("categoria").custom(existeCategoria),
    validarCampos
], crearProducto)


/*
utilizamos el metodo optional de router
para que si viene una propiedad categoria la valide
y si no viene no tira error
*/
routerProductos.put("/:id", [
    validarJWT,
    param("id", "no es un id de mongo").isMongoId(),
    param("id").custom(existeProducto), 
    body("categoria").optional().isMongoId(),
    body("categoria").optional().custom(existeCategoria),
    validarCampos
], actualizarProducto)



routerProductos.delete("/:id", [
    validarJWT,
    tieneRol("ADMIN_ROLE"),
    param("id", "no es un id de mongo").isMongoId(),
    param("id").custom(existeProducto),
    validarCampos
],borrarProducto)




export {
    routerProductos
}