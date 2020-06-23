const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const controller = require("../controllers/recetas");
const mongoose = require("mongoose");
const admin = require("../middleware/admin");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./media/");
  },
  filename: (req, file, cb) => {
    cb(null, new mongoose.Types.ObjectId() + file.originalname.substr(file.originalname.lastIndexOf(".")));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("La imagen debe ser JPEG"), false);
  }
};
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 3 }, fileFilter: fileFilter });

router.get("/", controller.recetas_get_all);
router.post("/",
  [checkAuth, admin],
  upload.single("newimage"),
  controller.recetas_create_receta
);
router.put(
  "/:idReceta",
  [checkAuth, admin],
  upload.single("newimage"),
  controller.recetas_update_receta
);
router.delete(
  "/:idReceta",
  [checkAuth, admin],
  controller.recetas_delete_receta
);

module.exports = router;
router.get("/:idReceta", controller.recetas_get);