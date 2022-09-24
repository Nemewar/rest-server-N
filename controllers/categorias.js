import { request, response } from "express"
import { Categoria } from "../models/index.js";




/* el método populate de mongoose permite 
obtener datos de un registro que pertenecese a otra collecion
dentro de una coleccion. Le asignamos populate
al registro que queremos buscar 

si queremos todo el registro:
.populate('publicaciones')


si queremos el registro con algunas especificaciones
.populate({
    path: 'publicaciones',
    select: '_id titulo', // separados por un espacio
    match: { titulo: /cien/i },
    options: { limit: 10, sort: { titulo: 1 } }
})
*/




const obtenerCategorias = async (req = request, res = response) => {


    const { limite = 5, desde = 0 } = req.query

    const query = {
        estado: true
    }

   

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate("usuario","nombre")
            .skip(parseInt(desde))
            .limit(parseInt(limite))
    ])


    res.status(200).json( {
        total,categorias
    })
}

const obtenerCategoria = async (req = request, res = response) => {

    const id = req.params.id;

    const categoria = await Categoria.findById(id)
        .populate({
            path: "usuario",
            select: "_id correo rol"
        });

    if (!categoria) {
        return res.status(400).json({
            msg: `El ${id} no existe`
        })
    }

    if (!categoria.estado) {
        return res.status(400).json({
            msg: `Categoria no activa`
        })
    }

    res.status(200).json({
        categoria,
    })

}

const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaBD = await Categoria.findOne({ nombre: nombre });


    if (categoriaBD) {
        return res.status(400).json({
            msg: `La categoria ${categoriaBD.nombre} ya existe`
        })
    }


    //generar data
    const data = {
        nombre,
        usuario: req.usuarioAutenticado._id
    }

    //guardar en bd
    const categoria = await new Categoria(data);

    await categoria.save();


    res.status(201).json(categoria);
}

const actualizarCategoria = async (req = request, res = response) => {
    const id = req.params.id;

    const existeCategegoria = await Categoria.findById(id);

    if (!existeCategegoria) {
        return res.status(400).json({
            msg: `No existe una categoria con ese ${id}`
        })
    }

    let { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuarioAutenticado._id;

    //el tercer parametro {new:true} es para que nos devuelva
    //el registro actualizado y no el anterior
    const categoriaActualizada = await Categoria.findByIdAndUpdate(id, data , {new:true});

    return res.status(200).json({
        msg: `Put operation`,
        categoriaActualizada
    })


}

const borrarCategoria = async (req = response, res = response) => {

    const id = req.params.id;

    const categoria = await Categoria.findById(id);

    if (!categoria) {
        return res.status(400).json({
            msg: `El ${id} no existe`
        })
    }

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {
        estado: false
    }, {new:true})

    return res.status(200).json({
        msg: `Delete operation`,
        categoriaBorrada
    })
}


export {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}