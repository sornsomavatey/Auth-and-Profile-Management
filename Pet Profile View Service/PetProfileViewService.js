const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const port = 3004;

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

// View Pet Profile API
app.get('/viewProfile/:petID', async (req, res) => {
    const { petID } = req.params;
  
    try {
      const profile = await PetProfile.findOne({ petID });
  
      if (!profile) {
        return res.status(404).json({ status: 404, message: "Pet profile not found for this ID." });
      }
  
      res.status(200).json({ status: 200, message: "Pet profile retrieved successfully", profile });
  
    } catch (error) {
      res.status(500).json({ status: 500, message: "Error retrieving profile", error: error.message });
    }
  });
  