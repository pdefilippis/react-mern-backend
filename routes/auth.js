const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const router = Router();

const {crearUsuario, loguinUsuario, revalidarToken} = require('../controllers/auth');

router.post(
    '/new', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({min:6}),
        validarCampos,
    ], 
    crearUsuario);

router.post(
    '/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({min:6}),
        validarCampos,
    ],
    loguinUsuario);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;