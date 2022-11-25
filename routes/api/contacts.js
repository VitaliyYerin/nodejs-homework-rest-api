const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts.js");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string()
    .pattern(/[A-Za-z]\s/)
    .min(2)
    .max(30)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().pattern(/^\d+$/).min(10).max(14).required(),
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json({ message: "success", data: contacts });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (contact) {
    return res.json({
      message: "success",
      data: contact,
    });
  }
  return res.status(404).json({ message: "Not Found" });
});

router.post("/", async (req, res, next) => {
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    const [details] = error.details;
    return res.status(400).json({ message: details.message });
  }
  const newContact = { id: uuidv4(), ...body };
  await addContact(newContact);

  return res.status(201).json({ message: "contact added", data: newContact });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const filteredContacts = await removeContact(contactId);

  if (filteredContacts) {
    return res.json({ message: "contact deleted" });
  }
  return res.status(404).json({ message: "Not Found" });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { error, value: body } = schema.validate(req.body);

  if (!Object.keys(body).length) {
    return res.status(400).json({ message: "missing fields" });
  }

  if (error) {
    const [details] = error.details;
    return res.status(400).json({ message: details.message });
  }

  try {
    const updatedContact = await updateContact(contactId, body);
    return res.json({ message: "success", data: updatedContact });
  } catch (err) {
    return res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;