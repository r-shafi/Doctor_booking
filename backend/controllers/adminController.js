import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";

const log = (message) => {
  console.log(`[ADMIN LOG] ${new Date().toISOString()} - ${message}`);
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    log(`Login attempt with email: ${email}`);

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      log(`Admin login successful`);
      res.json({ success: true, token });
    } else {
      log(`Admin login failed: Invalid credentials`);
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentsAdmin = async (req, res) => {
  try {
    log("Fetching all appointments");
    const appointments = await appointmentModel.find({});
    log(`Fetched ${appointments.length} appointments`);
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("[FETCH APPOINTMENTS ERROR]", error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    log(`Cancelling appointment ID: ${appointmentId}`);
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    log(`Appointment ${appointmentId} cancelled successfully`);
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error("[CANCEL APPOINTMENT ERROR]", error);
    res.json({ success: false, message: error.message });
  }
};

const addDoctor = async (req, res) => {
  try {
    let { name, email, speciality, degree, experience, about, fees, address } =
      req.body;
    const imageFile = req.file;

    log(`Attempting to add new doctor: ${name} (${email})`);

    if (
      !name ||
      !email ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      log("Missing required doctor details");
      return res.json({ success: false, message: "Missing Details" });
    }

    email = email.trim().toLowerCase();

    if (!validator.isEmail(email)) {
      log("Invalid email format");
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      log(`Doctor with email ${email} already exists`);
      return res.json({ success: false, message: "Email already in use" });
    }

    log("Generating password and hashing it");
    const salt = await bcrypt.genSalt(10);
    const password = Math.random().toString(36).slice(2);
    const hashedPassword = await bcrypt.hash(password, salt);

    log("Uploading doctor image to Cloudinary");
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;
    log("Image uploaded successfully");

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    log("Saving doctor data to database");
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    log("Doctor saved successfully");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Doctor Booking App" <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Doctor Account Created",
      html: `
                <h3>Welcome Dr. ${name},</h3>
                <p>Your profile has been added successfully to the system.</p>
                <p><b>Login Credentials:</b></p>
                <ul>
                    <li>Email: ${email}</li>
                    <li>Password: ${password}</li>
                </ul>
                <p>Please log in to your account and update your profile as needed.</p>
                <br>
                <p>Thanks,<br/>Doctor Booking Team</p>
            `,
    };

    log(`Sending welcome email to ${email}`);
    await transporter.sendMail(mailOptions);
    log("Email sent successfully");

    res.json({ success: true, message: "Doctor Added and Email Sent" });
  } catch (error) {
    console.error("[ADD DOCTOR ERROR]", error);
    res.json({ success: false, message: error.message });
  }
};

const allDoctors = async (req, res) => {
  try {
    log("Fetching all doctors");
    const doctors = await doctorModel.find({}).select("-password");
    log(`Fetched ${doctors.length} doctors`);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("[FETCH DOCTORS ERROR]", error);
    res.json({ success: false, message: error.message });
  }
};

const adminDashboard = async (req, res) => {
  try {
    log("Loading admin dashboard data");

    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse(),
    };

    log("Dashboard data prepared");
    res.json({ success: true, dashData });
  } catch (error) {
    console.error("[DASHBOARD ERROR]", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
};
