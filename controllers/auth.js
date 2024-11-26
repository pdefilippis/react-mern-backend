const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async (req , res = response)=>{
    const {email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({email});
        if (usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            });
        }

        usuario = new Usuario(req.body);

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            "ok": true,
            "msg": "nuevo usuario",
            uid: usuario.id,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "ok": false,
            "msg": "Por favor hable con el administrador"
        })
    }
    
}

const loguinUsuario = async(req, res = response)=>{
    const {email, password} = req.body; 

    try {
        const usuario = await Usuario.findOne({email});
        console.log('usuario', usuario);
        if (!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'El passowrd es incorrecto'
            })
        }

        const token = await generarJWT(usuario.id, usuario.name);

        return res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "ok": false,
            "msg": "Por favor hable con el administrador"
        })
    }
}

const revalidarToken = async(req, res = response)=>{

    const token = await generarJWT(req.uid, req.name);
    res.json({
        ok:true,
        uid: req.id,
        name: req.name,
        token
    });
}

module.exports ={
    crearUsuario,
    loguinUsuario,
    revalidarToken
}