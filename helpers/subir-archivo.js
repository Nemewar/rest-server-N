import path from "path";
import { v4 as uuidv4 } from 'uuid';

const subirArchivo = (files, extensionesValidas = ["png", "jpg", "jpeg", "gif"], carpeta = "") => {


    return new Promise((resolve, reject) => {

        const { archivo } = files;

        //obtener la extensión del archivo
        const nombreCortado = archivo.name.split(".");
        const extension = nombreCortado[nombreCortado.length - 1].toLowerCase();

        //validar extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida - ${extensionesValidas}`)
        }


        //establecer la ruta en doonde se guardara el archivo
        //path.resolve(), Nos trae la ruta en donde se encuentra este archivo
        //upload.js de los controladores
        const nombreTemp = uuidv4() + "." + extension;//nombre del archivo con su extension
        const uploadPath = path.join(path.resolve(), './uploads/',carpeta, nombreTemp)

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err)
            }

            return resolve(nombreTemp)
        });

    })






}


export {
    subirArchivo
}