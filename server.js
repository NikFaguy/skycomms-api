"use strict";

//IMPORT
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const nodemailer = require('nodemailer')
const webToken = require('jsonwebtoken');
const history = require('connect-history-api-fallback');

//MODELS
const User = require("./models/userModel");

//Import routes
const userRoutes = require("./routes/user");
const discussionRoutes = require("./routes/discussionRoutes");
const commentRoutes = require("./routes/commentRoutes");

//Create express app
const app = express();

//Enable CORS
app.use(cors({
  origin: [
    "https://skycomms-git-main-nikfaguys-projects.vercel.app",
    "https://skycomms-nikfaguys-projects.vercel.app",
    "https://skycomms.vercel.app",
    "https://vercel.com/nikfaguys-projects/skycomms/AaFmZiMmrzm88E4nhjPJWrTMQtue"
  ],
  credentials: true,
  optionSuccessStatus: 200,
}));

//MIDDLEWARES
const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

//Error handling
app.use((error, req, res, next) => {
  console.log("Erreur:", error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

//parse JSON bodies and attach them to req.body
app.use(express.json());

//Log requests
app.use((req, res, next) => {
  console.log(`Path: ${req.path} | Method: ${req.method}`);
  next();
});

//Routes
app.use("/user", userRoutes);
app.use("/discussion",discussionRoutes);
app.use("/comment",commentRoutes);

app.use(history());

//Connect to MongoDB
mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => {
    console.log("[BACKEND] - Connected to MongoDB");

    app.listen(process.env.PORT || 3000, () => {
      console.log( "[BACKEND] - Server is listening on http://localhost:" + process.env.PORT);
    });
  })
  .catch((error) => console.log(error));


  //Récupération du mot de passe
  app.post("/send_password_recovery", async (req, res) => {
    try {

      const { email } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ error: "cette addresse courriel n'a pas été trouvé" });
      }
  
      const token = webToken.sign({ id: user._id }, process.env.WEB_TOKEN_KEY, { expiresIn: "1d" });
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SITE_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });
  
      var mailOptions = {
        from: process.env.SITE_EMAIL,
        to: user.email,
        subject: 'Lien de récupération de mot de passe',
        text: `http://localhost:3000/resetPassword/${user._id}/${token}`
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: `Erreur lors de l'envoi de l'email: ${error}` });
        } else {
          return res.send({ Status: "Success" });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: `Erreur lors de la recherche de l'utilisateur:${error}` });
    }
  });

  app.post('/newPassword', async (req, res) => {
    try {
  
      const { id,token,password } = req.body;
      console.log(req.body)
  
      //Vérification du token
      const decoded = await new Promise((resolve, reject) => {
        webToken.verify(token, process.env.WEB_TOKEN_KEY, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });
  
      //Mise à jour du mot de passe
      const user= await User.findByIdAndUpdate({ _id: id }, { password: password });
      console.log(user)

      //Message si réussi
      res.json({ Status: "Le mot de passe a été réinitialisé avec succès." });
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Le mot de passe n\'a pas été réinitialisé.' });
    }
  });