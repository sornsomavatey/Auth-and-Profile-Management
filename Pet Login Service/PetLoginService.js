const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const port = 3002;

app.listen(port, '0.0.0.0', () => {
  console.log(`Pet Login Service running on http://localhost:${port}`);
});

// MongoDB Connection
mongoose.connect('mongodb+srv://Vatey:vatey2609@cluster0.disrk.mongodb.net/PetCarePlatform?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Schema must match the one used in registration
const petSchema = new mongoose.Schema({
  petID: { type: String, unique: true, required: true },
  petName: { type: String, required: true },
  petBreed: { type: String, required: true },
  petAge: { type: String, required: true },
  petOwnermobile: { type: String, unique: true, required: true }
});

const Pet = mongoose.model('petregistration', petSchema);

// Pet Login API
app.post('/loginPet', async (req, res) => {
  const { petOwnermobile } = req.body;

  try {
    const existingPet = await Pet.findOne({ petOwnermobile });

    if (!existingPet) {
      return res.status(401).json({ status: 401, message: "Pet owner not found. Please register first." });
    }

    res.status(200).json({
      status: 200,
      message: "Login successful",
      petName: existingPet.petName,
      petID: existingPet.petID
    });

  } catch (error) {
    res.status(500).json({ status: 500, message: "Error during login", error: error.message });
  }
});
