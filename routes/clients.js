const router = require('express').Router()

const clientsController = require('../controllers/clients')
const { IsAuthenticated } = require("../middleware/authenticate")

router.get('/', clientsController.getAll);

router.get('/:id', clientsController.getSingle);

router.post('/', IsAuthenticated ,clientsController.createClient);

router.put('/:id', IsAuthenticated, clientsController.updateClient);

router.delete('/:id', IsAuthenticated, clientsController.deleteClient);

module.exports = router;