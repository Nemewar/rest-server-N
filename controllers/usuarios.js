import { request, response } from "express";
import bcryptjs from "bcryptjs";

import { Usuario } from "../models/usuario.js";

const usuariosGet = async (req = request, res = response) => {


    const { limite = 5, desde = 0 } = req.query;
    const query = {
        estado: true
    }

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(parseInt(desde))
            .limit(parseInt(limite))
    ])

    res.status(201).json({
        msg: "get API - controlador",
        total,
        totalCurrentQuery: usuarios.length,
        usuarios
    })
}

const usuariosPost = async (req = request, res = response) => {



    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });


    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);


    await usuario.save();


    res.json({
        msg: "post API - controlador",
        usuario
    })
}

const usuariosPut = async (req = request, res = response) => {

    const id = req.params.id;
    const { _id, password, google, ...resto } = req.body;


    if (password) {
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: "put API - controlador",
        usuario
    })
}

const usuariosDelete = async (req = request, res = response) => {
    
    const {id} = req.params;

    const usuarioAutenticado = req.usuarioAutenticado;

    //este usuario1 nos devuelve el usuario anterior antes de volverse false
    const usuario1 = await Usuario.findByIdAndUpdate(id,{estado:false});
    const usuario = await Usuario.findById(id);

    res.json({
        msg: "delete API - controlador",
        usuario,
        usuarioAutenticado
    })
}



export {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}