require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
const { MongoClient } = require("mongodb");
app.use(cors()); 
const PORT = 5050;
const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL);

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

let db;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect once when server starts
client.connect().then(() => {
  console.log("✅ MongoDB connected");
  db = client.db("Simon-University");
}).catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});

// Basic default route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// GET all users
app.get("/getUsers", async (req, res) => {
  try {
    const data = await db.collection('users').find({}).toArray();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

// POST new user
app.post("/addUser", async (req, res) => {
  try {
    const userObj = req.body;
    console.log("Received:", userObj);

    const result = await db.collection('users').insertOne(userObj);
    console.log("✅ Data inserted:", result.insertedId);

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userObj.email,
      subject: 'College Application Confirmation',
      html: `
        <h2>Dear ${userObj.username},</h2>
        <p>Thank you for submitting your college application to Simon University.</p>
        <p>We have received your application and will review it shortly. Here are the details we received:</p>
        <ul>
          <li>Name: ${userObj.username}</li>
          <li>Email: ${userObj.email}</li>
        </ul>
        <p>We will contact you soon regarding the next steps in the application process.</p>
        <p><b>Best regards,<br>Simon University Admissions Team</b></p>
         <h4>Good Luck From Principal: <br>Siddarth Kone, Toronto University, Ontario, Canada</h4>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Confirmation email sent to:", userObj.email);

    res.status(200).send("User added successfully and confirmation email sent");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing application");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
