const usersController = require("../controllers/user.controller");

const express = require("express");
const router = express.Router();

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/user-profile", usersController.userProfile);
router.post("/add-attendance", usersController.addAttendance);
router.get("/report", usersController.report);
router.delete("/delete-user-account", usersController.deleteUserAccount);
module.exports = router;