
import { Router } from "express";
import { body, param , check } from "express-validator";

import { googleSignin, login } from "../controllers/auth.js";
import { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias } from "../controllers/categorias.js";
import { existeCategoria } from "../helpers/dbValidators.js";
import { tieneRol, validarCampos,validarJWT } from "../middlewares/index.js";


const routerCategorias = Router();

//Obtener todas las categorias
routerCategorias.get("/", obtenerCategorias);


//Obtener una categoría por id - publico
routerCategorias.get("/:id", [
    param("id","No es un id de mongo").isMongoId(),
    param("id").custom(existeCategoria),
    validarCampos
],obtenerCategoria);

//crear una nueva categoria - privado- cualquier persona con un token valido
routerCategorias.post("/", [
    validarJWT,
    body("nombre","El nombre es obligatorio").not().isEmpty(),
    validarCampos
], crearCategoria
);


//actualizar un registro de las categorias por id
routerCategorias.put("/:id", [
    validarJWT,
    body("nombre","El nombre es obligatorio").not().isEmpty(),
    param("id").custom(existeCategoria),
    validarCampos
],actualizarCategoria);


//Borrar una categoria - Admin Role
routerCategorias.delete("/:id", [
    validarJWT,
    tieneRol("ADMIN_ROLE"),
    param("id","No es un id de Mongo").isMongoId(),
    param("id").custom(existeCategoria),
    validarCampos
],borrarCategoria);



export{
    routerCategorias
}