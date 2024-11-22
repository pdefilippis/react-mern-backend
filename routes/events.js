const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {getEventos, crearEvento, eliminarEvento, actualizarEvento} = require('../controllers/events');
const {isDate} = require('../helpers/isDate');
const router = Router();

router.use(validarJWT);

router.get('/', getEventos);
router.post('/', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos
],crearEvento);
router.put('/:id', actualizarEvento);
router.delete('/:id', eliminarEvento);

module.exports = router
