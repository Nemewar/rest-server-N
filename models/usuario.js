// mongodb guarda objetos que estan dentro de colecciones
// coleccion es una tabla
// esto es como si fuera la tabla usuario con sus atributos


/*  
    {
        nombre: "",
        correo: "",
        password: "",
        img: "",//url
        rol: "",
        estado: boolean,//usuario activo o inactivo
        google: boolean,//si usuario fue creado por google o por nuestro sistema
    }
*/


import mongoose from "mongoose";
//ya no se usa
//import {Schema,model} from "mongoose"


const {Schema,model} = mongoose;

//UsuarioSchema es como la tabla que se creara
//mongoose da a una isntancia de esta tabla un valor de id x defecto
const  UsuarioSchema = new Schema({
    nombre: {
        type: String,
        //required, le podemos asignar solo un valor(true or false) o 
        //un arreglo: el primero elemento es su valor, y el segundo
        //mandar un mensaje de error en caso nos dea false
        required: [true, "El nombre es obligatorio"]
    },
    correo: {
        type: String,
        required: [true, "El correo es obligatorio"],
        //para evitar correos duplicados
        unique: true
    },
    password: {
        type: String,
        required: [true, "la contraseña es obligatoria"]
    },
    img: {
        type : String,
    },
    rol: {
        type: String,
        required: true,
        //roles permitidos
        default: "USER_ROLE"
    },
    estado: {
        type: Boolean,
        //agregar valor por defecto
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    }

});

//sobreescribiendo el res.json() para notener que enviar la contraseña
UsuarioSchema.methods.toJSON = function(){
    const {__v,password,_id,...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

//creamos un modelo llamado usuario con su esquema
export const Usuario = model("Usuario",UsuarioSchema);
