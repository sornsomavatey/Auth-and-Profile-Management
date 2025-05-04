const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const port = 3001;

app.listen(port, '0.0.0.0', () => {
  console.log(`Pet Register Service running on http://localhost:${port}`);
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://Vatey:vatey2609@cluster0.disrk.mongodb.net/PetCarePlatform?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Pet Schema
const petSchema = new mongoose.Schema({
  petID: { type: String, unique: true, required: true },
  petName: { type: String, required: true },
  petBreed: { type: String, required: true },
  petAge: { type: String, required: true},
  petOwnermobile: { type: String, unique: true, required: true }
});

const Pet = mongoose.model('petregistration', petSchema);

// Utility to generate 4-digit ID
const generatePetID = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// API to register a pet
app.post('/registerPet', async (req, res) => {
  const { petName, petBreed, petAge, petOwnermobile } = req.body;

  const petID = generatePetID();

  try {
    const existingPet = await Pet.findOne({ petID });

    if (existingPet) {
      return res.status(400).json({ status: 400, message: "Pet ID already exists. Please try again." });
    }

    // Check if petOwnermobile already exists
    const existingPhone = await Pet.findOne({ petOwnermobile });
    if (existingPhone) {
      return res.status(400).json({ status: 400, message: "Owner mobile number already registered. Please use a different number." });
    }
    const newPet = new Pet({ petID, petName, petBreed, petAge, petOwnermobile });
    await newPet.save();

    res.status(201).json({ status: 201, message: "Pet registered successfully", pet: newPet });

  } catch (error) {
    res.status(500).json({ status: 500, message: "Error registering pet", error: error.message });
  }
});
