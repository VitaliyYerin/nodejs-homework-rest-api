const express = require("express");

const {
  getAll,
  getById,
  create,
  remove,
  update,
  setStatus,
} = require("../../controllers/contactController");
const { asyncWrapper } = require("../../helpers/asyncWrapper");
const { bodyValidate } = require("../../validation/contactValidation");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, asyncWrapper(getAll));
router.get("/:contactId", authMiddleware, asyncWrapper(getById));
router.post("/", authMiddleware, bodyValidate, asyncWrapper(create));
router.delete("/:contactId", authMiddleware, asyncWrapper(remove));
router.put("/:contactId", authMiddleware, bodyValidate, asyncWrapper(update));
router.patch("/:contactId/favorite", authMiddleware, asyncWrapper(setStatus));

module.exports = router;