import jwt from "jsonwebtoken";
import {request,response} from "express";
import {Usuario} from "../models/usuario.js"

const validarJWT = async ( req = request,res=response, next) =>{

    //el front end nos tiene que enviar un x-token del header
    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "No hay token en la petición"
        });
    }

    try{
        //verifica si el json web token es válido, si no es válido se va al
        //bloque catch, este secretoprvitatekey guarda una relación con
        //todos los tokens generados mediante esete secretorprivtekey

        //cuando el token recibido no tiene la forma de un token
        //nos saldra el mensaje de jwt malformed
        //cuando el token recibido si tiene la forma de un token
        //pero no es un token válido saldra invalid signature

        //para ambos casos que suceda esto lanzara un error
        //pero no se detendra el programa porque estan dentro de un
        //bloque try-catch

        //este metodo retorna el payload del token
        const payload = jwt.verify(token,process.env.secretOrPrivateKey);
        const usuarioAutenticado = await Usuario.findById(payload.uid);

        if(!usuarioAutenticado){
            return res.status(401).json({
                msg: "Token no válido - usuario no existe en BD"
            })
        }

        if(!usuarioAutenticado.estado){
            return res.status(401).json({
                msg: "Token no válido -- usuario con estado false"
            })
        }

        req.usuarioAutenticado = usuarioAutenticado;
        

    }catch(error){
        console.log(error);
        return res.status(401).json({
            msg: "Token no válido"
        })
    }

    next();
}

export{
    validarJWT
}