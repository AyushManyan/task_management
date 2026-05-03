const router = require("express").Router();
const { register, login, getAllUsers } = require("../controllers/authController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Route to get all users (for admin panel member assignment)
router.get("/users", protect, isAdmin, getAllUsers);
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

router.post("/signup", registerValidator, register);
router.post("/login", loginValidator, login);

module.exports = router;