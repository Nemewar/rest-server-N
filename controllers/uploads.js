import * as path from "path"
import * as fs from "fs"
import { request, response } from "express";


import {v2 as cloudinary} from "cloudinary";
cloudinary.config( process.env.CLOUDINARY_URL)//enlazar cloudinary con nuestra aplicacion



import { subirArchivo } from "../helpers/index.js";
import { Producto } from "../models/producto.js";
import { Usuario } from "../models/usuario.js";



const cargarArchivo = async (req = request, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({ msg: "No hay archivos que subir" });
        return;
    }


    try {
        //para crear carpetas tener el createParentPath en true en el server.js
        //const nombreArchivo = await subirArchivo(req.files, ["txt", "md"],"textos");

        //undefined porque ocupamos enviar todos los directorios al querer
        //crear una carpeta nueva
        const nombreArchivo = await subirArchivo(req.files, undefined, "imgs");
        res.json({
            nombre: nombreArchivo
        })
    } catch (err) {
        res.status(400).json({
            err
        })
    }

}

//Actualizar imagen segun la coleccion que hayamos puesto en el endpoint
const actualizarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe un usuario con el id ${id}`
                })
            }
            break;

        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: "se me olvidó validar esto"
            })

    }

    // Limpiar imagenes previas
    if (modelo.img) {
        //hay que borrar la imagen del servidor
        const pathImagen = path.join(path.resolve(), "./uploads", coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {

            //borra el archivo de esa ruta
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json({
        id,
        coleccion,
        modelo
    })
}

const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe un usuario con el id ${id}`
                })
            }
            break;

        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: "se me olvidó validar esto"
            })

    }

    // Borramos la imagen que tenga el usuario en cloudinary
    if (modelo.img) {
        const nombreArr = modelo.img.split("/");
        const nombre = nombreArr[nombreArr.length-1];
        const [public_id] = nombre.split(".");

        cloudinary.uploader.destroy(public_id);
    }
    
    //subir el archivo a cloudinary y el link de la imagen que se genera
    //guardarla en modelo.img
    const {tempFilePath} = req.files.archivo
    // const respuesta = await cloudinary.uploader.upload(tempFilePath);
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;

    await modelo.save();

    return res.json({
        modelo
    })
}

//enviar imagen al front
const mostrarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: "se me olvidó validar esto"
            })

    }

    // Limpiar imagenes previas
    if (modelo.img) {
        const pathImagen = path.join(path.resolve(), "./uploads", coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }


    const pathNotFound = path.join(path.resolve(),"./assets/no-image.jpg")

    return res.sendFile(pathNotFound)

}




export {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}