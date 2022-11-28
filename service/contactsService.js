const { Contact } = require("../schemas/Contact");

const getAllContacts = async (req, { page, limit, favorite }) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const skip = parsedPage * parsedLimit - parsedLimit;
  const request = favorite ? { ...req, favorite } : req;

  return Contact.find(request)
    .populate("owner", { password: 0 })
    .skip(skip)
    .limit(parsedLimit);
};

const getContactById = async (id) => {
  return Contact.findById(id).populate("owner", { password: 0 });
};

const createContact = async (body) => {
  return Contact.create(body);
};

const deleteContact = async (id) => {
  return Contact.findByIdAndDelete(id).populate("owner");
};

const updateContact = async (id, body) => {
  return Contact.findByIdAndUpdate(id, body, { new: true }).populate("owner");
};

const updateContactStatus = async (id, body) => {
  return Contact.findByIdAndUpdate(
    id,
    { $set: { ...body } },
    { new: true }
  ).populate("owner");
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateContactStatus,
};