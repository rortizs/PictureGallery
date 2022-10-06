const { Router } = require("express");
const router = Router();
const Photo = require("../models/photo");
const cloudinary = require("cloudinary").v2; //!! modulo api cloudinary
const fs = require("fs-extra"); //!! modulo para eliminar archivos

//! connection cloudinary api configurations
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/", async (req, res) => {
  const photos = await Photo.find();
  res.render("image", { photos });
});

router.get("/images/add", async (req, res) => {
  const photos = await Photo.find();
  res.render("image_form", { photos });
});

router.post("/images/add", async (req, res) => {
  const { title, description } = req.body;
  const result = await cloudinary.uploader.upload(req.file.path);

  //* model image
  const newPhoto = new Photo({
    title,
    description,
    imageUrl: result.url, //* url de cloudinary
    public_id: result.public_id, //* public id de cloudinary
  });
  await newPhoto.save(); //* save en la base de datos
  await fs.unlink(req.file.path); //* elimina la foto del servidor local

  res.redirect("/");
});

router.get("/images/delete/:photo_id", async (req, res) => {
  const { photo_id } = req.params;
  const photo = await Photo.findByIdAndDelete(photo_id);
  const result = await cloudinary.uploader.destroy(photo.public_id);
  console.log(result);
  res.redirect("/images/add");
});

module.exports = router;
