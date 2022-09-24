import { response } from "express"


const validarArchivoSubir = (req, res = response, next) => {

    //verifica si es que en la request existe el objeto files y si
    //existe el objeto archivo de req.files que nos envio el front end
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ msg: "No hay archivos que subir" });
    }

    next();

}

export {
    validarArchivoSubir
}