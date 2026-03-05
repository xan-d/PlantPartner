const express = require('express');
const router = express.Router();
const plantCardController = require('../controllers/plantCardController');
const requireAuth = require('../middleware/requireAuth');

router.get('/', requireAuth, plantCardController.getAllPlants);
router.get('/:id/care', requireAuth, plantCardController.getPlantCare);
router.put('/:id/water', requireAuth, plantCardController.waterPlant);
router.get('/:id', requireAuth, plantCardController.getPlantById);
router.post('/', requireAuth, plantCardController.upload.single('image'), plantCardController.createPlant);
router.put('/:id', requireAuth, plantCardController.upload.single('image'), plantCardController.updatePlant);
router.delete('/:id', requireAuth, plantCardController.deletePlant);

module.exports = router;