
import { Router } from "express";
import { body, param } from "express-validator";



import { usuariosDelete, usuariosGet, usuariosPost, usuariosPut } from "../controllers/usuarios.js";
import { esRoleValido, existeEmail, existeUsuarioPorId } from "../helpers/dbValidators.js";


import { validarCampos,validarJWT,esAdminRol,tieneRol } from "../middlewares/index.js";




const routerUsuario = Router();

/* el método check de express-validator:
Crea una cadena de validación para uno o más campos. Pueden estar ubicados en cualquiera de los siguientes objetos de solicitud: req.body, req.cookies, req.headers,
req.params, req.query.

Esto conlleva un enorme riesgo.
Por ejemplo, digamos que en una peticion que nos hace el cliente, en el backend esperamos que nos llegue la siguiente información:
    body:
    {
        "nombre": "Alumno"
        "email": "alumno@email.com"
    }
Con check(), la siguiente petición de un cliente sería válida porque "nombre" se encuentra como un parámetro de URL.

    URL: https://localhost/test?nombre=Alumno
    {
        "email": "alumno@email.com"
    }
Para ello es mejor remplazar check por body,param,cookie o header. según
sea el caso
*/

routerUsuario.get("/", usuariosGet)

routerUsuario.post("/", [
    body("nombre", "El nombre es obligatorio").not().isEmpty(),//no tiene que estar vacio
    body("password", "El password es obligatorio").not().isEmpty(),
    body("password", "El password debe ser más de 6 letras").isLength({ min: 6 }),
    body("correo", "El correo no es valido").isEmail(),
    body("correo").custom(existeEmail),
    body("rol").custom(esRoleValido),
    validarCampos
], usuariosPost)


routerUsuario.put("/:id", [
    param("id", "No es un Id Válido").isMongoId(),
    param("id").custom(existeUsuarioPorId),
    body("correo", "El correo no es valido").isEmail(),
    body("correo").custom(existeEmail),
    body("password", "El password debe ser más de 6 letras").isLength({ min: 6 }),
    body("rol").custom(esRoleValido),
    validarCampos
], usuariosPut)


//el encontrarse con un header(middleware) y no pasa la autenticacion, este termina
//por eso tenemos que poner al validarJWT como primera posicion
routerUsuario.delete("/:id", [
    validarJWT,
    //esAdminRol,
    tieneRol("ADMIN_ROLE","VENTAS_ROLE"),
    param("id", "No es un Id Válido").isMongoId(),
    param("id").custom(existeUsuarioPorId),
    validarCampos
],
    usuariosDelete)




export {
    routerUsuario
}



