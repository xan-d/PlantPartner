// const express = require("express");
// const db = require("../firebase");
// const router = express.Router();

// router.post("/users/:userID/plants", async (req, res) => {
//   try {
//     const { userID } = req.params;

//     console.log("req.body:", req.body);

//     const { name, species, sunlight, wateringFrequency, healthStatus, notes } = req.body;

//     // Step 1: Create plant info (auto-generated ID)
//     const plantInfoRef = await db.collection("plantInformation").add({
//       species,
//       sunlight,
//       wateringFrequency
//     });

//     // Step 2: Create the plant record
//     const newPlant = {
//       name,
//       plantInfoID: plantInfoRef.id, // auto-generated ID from step 1
//       lastWatered: new Date(),
//       lastFertilized: new Date(),
//       healthStatus: healthStatus || "Healthy",
//       notes: notes || ""
//     };

//     // Step 3: Save plant under the user
//     const plantRef = await db
//       .collection("users")
//       .doc(userID)
//       .collection("plants")
//       .add(newPlant);

//     // Respond with both IDs
//     res.status(201).json({
//       plantID: plantRef.id,
//       plantInfoID: plantInfoRef.id
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get("/users/:userID/plants", async (req, res) => {
//   try {
//     const { userID } = req.params;

//     const snapshot = await db
//       .collection("users")
//       .doc(userID)
//       .collection("plants")
//       .get();

//     const plants = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));

//     res.json(plants);
//   } catch (err) {
//     res.status(500).json({ error: "err.message" });
//   }
// });

// module.exports = router;

const express = require("express");
const db = require("../firebase"); // your firestore instance
const router = express.Router();

// ---------------------
// GET all plants for a user
// ---------------------
router.get("/users/:userID/plants", async (req, res) => {
  try {
    const { userID } = req.params;

    const snapshot = await db
      .collection("users")
      .doc(userID)
      .collection("plants")
      .get();

    const plants = [];

    for (const doc of snapshot.docs) {
      const plant = doc.data();

      // Get plant info from plantInformation collection
      let plantInfo = {};
      if (plant.plantInfoID) {
        const infoDoc = await db
          .collection("plantInformation")
          .doc(plant.plantInfoID)
          .get();
        plantInfo = infoDoc.exists ? infoDoc.data() : {};
      }

      plants.push({
        id: doc.id,
        name: plant.name,
        healthStatus: plant.healthStatus,
        notes: plant.notes,
        lastWatered: plant.lastWatered.toDate(),
        lastFertilized: plant.lastFertilized.toDate(),
        plantInfo
      });
    }

    res.json(plants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------
// POST create a new plant for a user
// ---------------------
router.post("/users/:userID/plants", async (req, res) => {
  try {
    const { userID } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty or missing JSON" });
    }

    const { name, species, sunlight, wateringFrequency, healthStatus, notes } = req.body;

    if (!name || !species || !sunlight || !wateringFrequency) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Step 1: Create plant info (auto-generated ID)
    const plantInfoRef = await db.collection("plantInformation").add({
      species,
      sunlight,
      wateringFrequency
    });

    // Step 2: Create plant record under the user
    const newPlant = {
      name,
      plantInfoID: plantInfoRef.id,
      lastWatered: new Date(),
      lastFertilized: new Date(),
      healthStatus: healthStatus || "Healthy",
      notes: notes || ""
    };

    const plantRef = await db
      .collection("users")
      .doc(userID)
      .collection("plants")
      .add(newPlant);

    res.status(201).json({
      plantID: plantRef.id,
      plantInfoID: plantInfoRef.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
