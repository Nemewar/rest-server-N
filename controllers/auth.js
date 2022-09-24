import { json, request, response } from "express";
import bcryptjs from "bcryptjs";

import { Usuario } from "../models/usuario.js";
import { generarJWT } from "../helpers/generarJWT.js";
import { googleVerify } from "../helpers/google-verify.js";


//post operation
const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo: correo });
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario/password no son válidos - correo"
            })
        }

        //si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario/password no son válidos - estado:false"
            })
        }

        //verificar la contraseña
        //compara el password que le mandamos con el password que hay en la bd
        //y retorna un booleano
        const validPasword = bcryptjs.compareSync(password, usuario.password);
        if (!validPasword) {
            return res.status(400).json({
                msg: "Usuario/password no son válidos - password"
            })
        }


        //generar el jwt
        const token = await generarJWT(usuario.id);

        res.json({
            msg: "Login Ok",
            usuario,
            token
        })


    } catch (error) {
        return res.status(500).json({
            msg: "Hable con el administrador"
        })
    }



}

//Para que el usuario pueda logearse al sistema mediante google
const googleSignin = async (req=request,res=response) => {

    const {id_token} = req.body;

    try{
        const {nombre,correo,img} = await googleVerify(id_token);
        
        let usuario =  await Usuario.findOne({correo:correo});

        if(!usuario){
            //crear usuario
            const data = {
                nombre,
                correo,
                password: "1234567",
                img,
                google:true
            };

            const usuario = new Usuario(data);
            await usuario.save();
        }

        //verificar estado del usuario si es que existe
        if(!usuario.estado){
            return res.status(401).json({
                msg: "Hable con el administrador, usuario bloqueado"
            })
        }

        const token = await generarJWT(usuario.id);

        res.json({
            msg:"Todo bien",
            usuario,
            token
        })

    }catch(error){
        res.status(400).json({
            ok:false,
            msg:"token no se pudo verificar"
        })
    }

    
}



export {
    login,
    googleSignin
}