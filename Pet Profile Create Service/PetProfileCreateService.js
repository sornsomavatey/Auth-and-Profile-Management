const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const port = 3003;

app.listen(port, '0.0.0.0', () => {
  console.log(`Pet Profile Service running on http://localhost:${port}`);
});

// MongoDB Connection
mongoose.connect('mongodb+srv://Vatey:vatey2609@cluster0.disrk.mongodb.net/PetCarePlatform?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Pet Profile Schema
const petProfileSchema = new mongoose.Schema({
  petID: { type: String, required: true }, // Must match pet registration
  petWeight: { type: String },
  petVaccinationStatus: { type: String },
  petFoodPreference: { type: String },
  petMedicalCondition: { type: String }
});

const PetProfile = mongoose.model('petprofiles', petProfileSchema);

// Create Pet Profile API
app.post('/createProfile', async (req, res) => {
  const {
    petID,
    petWeight,
    petVaccinationStatus,
    petFoodPreference,
    petMedicalCondition
  } = req.body;

  try {
    // Check if profile already exists for this pet
    const existingProfile = await PetProfile.findOne({ petID });
    if (existingProfile) {
      return res.status(400).json({ status: 400, message: "Profile already exists for this pet ID." });
    }

    const newProfile = new PetProfile({
      petID,
      petWeight,
      petVaccinationStatus,
      petFoodPreference,
      petMedicalCondition
    });

    await newProfile.save();

    res.status(201).json({ status: 201, message: "Pet profile created successfully", profile: newProfile });

  } catch (error) {
    res.status(500).json({ status: 500, message: "Error creating profile", error: error.message });
  }
});
