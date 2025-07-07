const { requireUser } = require('../middleware/requires-user');
const { checkAdmin } = require('../middleware/check-admin');

module.exports = (app) => {

    let router = require('express').Router();
    const controller = require('../controller/ability.controller');

    // Rutas para las habilidades
    router.post('/createAbility', requireUser, checkAdmin, controller.createAbility);
    router.get('/', requireUser,checkAdmin, controller.getAllAbilities);
    router.get('/:pokemonId', requireUser, controller.getAllAbilitiesFromPokemon);
    router.delete('/deleteAbility/:id', requireUser, checkAdmin, controller.deleteAbility);
    router.patch('/updateAbility/:id', requireUser, checkAdmin, controller.updateAbility);


    router.get('/abilities', requireUser, controller.getAllAbilities);


    app.use('/ability', router);
}