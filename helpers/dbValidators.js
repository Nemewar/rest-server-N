import { Categoria } from "../models/categoria.js";
import { Producto } from "../models/producto.js";
import { Role } from "../models/role.js"
import { Usuario } from "../models/usuario.js";


const esRoleValido = async (rol = "") => {
    const existeRol = await Role.findOne({ rol: rol })
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la bd`)
    }
}

const existeEmail = async (correo = "") => {
    const existeEmail = await Usuario.findOne({ correo: correo })
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe`)
    }
}

const existeUsuarioPorId = async (id = "") => {
    const existeID = await Usuario.findById(id);
    if (!existeID) {
        throw new Error(`El id ${id} no existe`)
    }
}

const existeCategoria = async (id = "") => {
    const existeID = await Categoria.findById(id);
    if (!existeID) {
        throw new Error(`El id ${id} no existe`)
    }
}

const existeProducto = async (id = "") => {
    const existeID = await Producto.findById(id);
    if (!existeID) {
        throw new Error(`El id ${id} no existe`)
    }
}

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`la coleccion ${coleccion} no es permitida - ${colecciones}`)
    }

    //usar return explicito debido a que en el router estamos llamando esta funcion
    //como un callback porque necesitamos enviarle parametros
    return true;
}




export {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}