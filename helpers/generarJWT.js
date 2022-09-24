import jwt from "jsonwebtoken";



const generarJWT = (uid = "") => {


    //el uid es lo unico que se va a almacenar en el payload del token
    //secretOrPrivateKey es una llave secreta que si alguien la llega a conocer
    //va a poder firmar tokens como si ellos lo hubieran creado
    //por ello esto lo creamos en las variables de entorno

    //este secreorprivatekey o tambien llamado seed
    // nos sirve para guardar una relación de todas
    //los tokens generrados mediante esta secretorprivatekey
    //al momento de verificar usaremos esta secretorprivatekey, la cual
    //al recibir el token verificara si es q ese token es valido
    //con alguno de los tokens que tiene guardado

    return new Promise((resolve, reject) => {
        const payload = {uid};

        jwt.sign(payload,process.env.secretOrPrivateKey,{
            expiresIn: "4h"
        }, (err,token) => {
            if(err){
                console.log(err);
                reject(err)
            }else{
                resolve(token);
            }
        })

    })
}

export {
    generarJWT
}