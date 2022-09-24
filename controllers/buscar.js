import { response } from "express";
import mongoose from "mongoose";
import { Categoria, Producto, Usuario } from "../models/index.js";

const coleccionesPermitidas = [
    "usuarios",
    "categoria",
    "productos",
    "roles"
]

//  /usuarios/(id o algo que haga match con lo que hayamos definido)
const buscarUsuarios = async (termino = "", res = response) => {

    const esMongoId = mongoose.Types.ObjectId.isValid(termino);

    //si el termino que nos mandan es un id(se quiere buscar un solo usuario)
    if (esMongoId) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }


    //para que la busqueda que hagamos sea insensible usamos esta
    //expresion regular
    const regex = new RegExp(termino, "i");


    //si el termino que nos mandan es un nombre
    //al mandarle una ER nos buscará todos los objetos que coincidan
    //con el termino y ademas que sean insensibles

    //operador or: si no encuentra datos que hagan match en el primer objeto
    //el nombre con el regex, va a buscar si hacen match en el segundo objeto
    //el correo y el regex y si igualmente no hacen match retorna un arreglo []

    //funciona esto tambien para que en vez de find podemos poner count
    //y nos retorna un número
    const [usuarios, countUsuarios] = await Promise.all([
        Usuario.find({
            $or: [{ nombre: regex }, { correo: regex }],
            $and: [{ estado: true }]
        }),
        Usuario.count({
            $or: [{ nombre: regex }, { correo: regex }],
            $and: [{ estado: true }]
        })
    ])

    if (usuarios.length === 0) {
        return res.status(400).json({
            msg: `No hay resultados para ${termino}`
        });
    }

    return res.json({
        countCurrent: countUsuarios,
        results: usuarios
    })


}

// /categoria/(id o algo que haga match con lo que hayamos definido)
const buscarCategoria = async (termino = "", res = response) => {

    const esMongoId = mongoose.Types.ObjectId.isValid(termino);
    if (esMongoId) {
        const categoria = await Categoria.findById(termino)
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, "i");

    const categorias = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    });

    if (categorias.length === 0) {
        return res.status(400).json({
            msg: `No hay resultados para ${termino}`
        });
    }

    return res.json({
        results: categorias
    })


}

// productos/(id o algo que haga match con lo que hayamos definido)
const buscarProductos = async (termino = "", res = response) => {
    const esMongoId = mongoose.Types.ObjectId.isValid(termino);
    if (esMongoId) {
        const producto = await Producto.findById(termino)
            .populate("categoria", "nombre");
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, "i");

    const productos = await Producto.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    })
        .populate("categoria", "nombre");

    if (productos.length === 0) {
        return res.status(400).json({
            msg: `No hay resultados para ${termino}`
        });
    }

    return res.json({
        results: productos
    })

}


//tarea
//el termino vendria a ser la categoria
//comparar respuestas en el chat de udemy clase de busquedas
const buscarProductosPorCategoria = async (termino = "", res) => {

}



const buscar = (req = response, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case "usuarios":
            buscarUsuarios(termino, res);
            break;
        case "categoria":
            buscarCategoria(termino, res);
            break;
        case "productos":
            buscarProductos(termino, res);
            break;

        default:
            res.status(500).json({
                msg: "se olvidó hacer esta búsqueda"
            })
    }



}

export {
    buscar
}