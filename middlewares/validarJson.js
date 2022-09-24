
//Cuando el cliente hace una peticion post y en el body pone cualquier
//cosa que no sea un objeto, la aplicación se cuelga
//para ello creamos este middleware para evitar que la aplicación se cuelgue
//cuando recibe un json del body malformado
const validarJSON = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
        res.status(400)
        res.set('Content-Type', 'application/json')
        res.json({
            message: 'JSON malformed'
        })
    } else {
        next();
    }

}

export{
    validarJSON
}