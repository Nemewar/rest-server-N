import { request, response } from "express"
import { Producto, Usuario } from "../models/index.js";



const obtenerProductos = async (req = request, res = response) => {

    const { base = 0, limite = 5 } = req.query;

    const query = {
        estado: true
    }


    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate("usuario", "nombre rol")
            .populate("categoria", "nombre")
            .skip(parseInt(base))
            .limit(parseInt(limite))
    ])


    res.status(200).json({
        total,
        productos
    })


}

const obtenerProducto = async (req = request, res = response) => {

    const id = req.params.id;

    const producto = await Producto.findById(id)
        .populate("usuario")
        .populate("categoria");

    res.status(200).json({
        msg: "get method - id",
        producto
    })
}

const crearProducto = async (req = request, res = response) => {

    //si no nos envia precio u descripcion, no lo guarda en la bd
    //esto mongoose al detectar que es undefined no crea un campo  de ese
    //undefined
    const { nombre, precio, categoria, descripcion, ...resto } = req.body;

    const productoDB = await Producto.findOne({nombre:nombre});

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${nombre} ya existe`
        })
    }

    const producto = await new Producto({
        nombre : nombre.toUpperCase(),
        precio,
        categoria,
        descripcion,
        usuario: req.usuarioAutenticado._id
    })

    await producto.save();

    res.status(201).json({
        msg: "post method",
        producto
    })


}

const actualizarProducto = async (req = request, res = response) => {

    const id = req.params.id;

    const { nombre,precio, ...resto } = req.body;


    const usuario = await Producto.findByIdAndUpdate(id, {
        nombre: nombre.toUpperCase(),
        precio,
        usuario: req.usuarioAutenticado._id
    },
        { new: true });

    res.status(200).json({
        msg: "put method",
        usuario
    })


}

const borrarProducto = async (req = request, res = response) => {


    const id = req.params.id;

    const producto = await Producto.findByIdAndUpdate(id,
         { estado: false }, 
         { new: true });

    res.status(200).json({
        msg : "delete method",
        producto
    })

}

export {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}