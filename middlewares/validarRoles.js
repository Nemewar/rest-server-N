import { request, response } from "express";

const esAdminRol = (req = request, res = response, next) => {

    if (!req.usuarioAutenticado) {
        return res.status(500).json({
            msg: "Se quiere verificar el rol sin validar el token primero"
        });
    }

    const { nombre, rol } = req.usuarioAutenticado;

    if (rol !== "ADMIN_ROLE") {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede realizar esta petición`
        })
    }

    next();
}

//este spread operator recibe todos los argumentos y los guarda en un arreglo
const tieneRol = (...roles) => {

    return (req = request, res = response, next) => {

        if (!req.usuarioAutenticado) {
            return res.status(500).json({
                msg: "Se quiere verificar el rol sin validar el token primero"
            });
        }

        if (!roles.includes(req.usuarioAutenticado.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles : ${roles}`
            })
        }

        next();
    }
}


export {
    esAdminRol,
    tieneRol
}