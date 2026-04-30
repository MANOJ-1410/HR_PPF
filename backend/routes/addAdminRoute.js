const express = require("express");
const { getaddAdmin, createaddAdmin, deleteaddAdmin } = require("../controllers/addAdminController");

const router = express.Router();

router.get("/" , getaddAdmin);
router.post("/", createaddAdmin);
router.delete("/:id", deleteaddAdmin);

module.exports = router;