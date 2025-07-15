import mongoose from "mongoose";
import dotenv from "dotenv";
import doctorModel from "./models/doctorModel.js";

dotenv.config();

const doctors = [
  {
    name: "Dr. Ayesha Rahman",
    email: "ayesha.rahman@example.com",
    password: "hashedpassword1",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    speciality: "General physician",
    degree: "MBBS",
    experience: "5 years",
    about: "Experienced general physician.",
    available: true,
    fees: 500,
    slots_booked: {},
    address: { city: "Dhaka", street: "123 Main St" },
    date: Date.now(),
  },
  {
    name: "Dr. Shafiur Islam",
    email: "shafiur.islam@example.com",
    password: "hashedpassword2",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    speciality: "Dermatologist",
    degree: "MD Dermatology",
    experience: "8 years",
    about: "Specialist in skin diseases.",
    available: false,
    fees: 700,
    slots_booked: {},
    address: { city: "Chittagong", street: "456 Lake Rd" },
    date: Date.now(),
  },
  {
    name: "Dr. Nusrat Jahan",
    email: "nusrat.jahan@example.com",
    password: "hashedpassword3",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    speciality: "Gynecologist",
    degree: "MBBS, MS",
    experience: "10 years",
    about: "Expert in women's health.",
    available: true,
    fees: 800,
    slots_booked: {},
    address: { city: "Sylhet", street: "789 Hill St" },
    date: Date.now(),
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await doctorModel.deleteMany({});
    await doctorModel.insertMany(doctors);
    console.log("Doctors seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
