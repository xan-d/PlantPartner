const express = require('express');
const router = express.Router();
const plantCardController = require('../controllers/plantCardController');

router.get('/', plantCardController.getAllPlants);
router.get('/:id/care', plantCardController.getPlantCare);
router.put('/:id/water', plantCardController.waterPlant);
router.get('/:id', plantCardController.getPlantById);
router.post('/', plantCardController.upload.single('image'), plantCardController.createPlant);
router.put('/:id', plantCardController.upload.single('image'), plantCardController.updatePlant);
router.delete('/:id', plantCardController.deletePlant);




module.exports = router;