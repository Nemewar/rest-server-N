import { validationResult } from "express-validator/src/validation-result.js";
import {request,response} from "express";



const validarCampos = (req=request,res=response,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors)
    }
    next();

}

export{
    validarCampos
}