const {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateContactStatus,
} = require("../service/contactsService");

const getAll = async (req, res, next) => {
  const { user, query } = req;

  const contacts = await getAllContacts({ owner: { _id: user._id } }, query);

  return res.json({ message: "success", data: contacts });
};

const getById = async (req, res, next) => {
  const { user } = req;
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  return contact && contact.owner._id.toString() === user._id.toString()
    ? res.json({
        message: "success",
        data: contact,
      })
    : res.status(404).json({ message: "Not Found" });
};

const create = async (req, res, next) => {
  const { body, user } = req;
  const result = await createContact({ ...body, owner: user._id });

  return res.status(201).json({ message: "contact added", data: result });
};

const remove = async (req, res, next) => {
  const { user } = req;
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  return contact && contact.owner._id.toString() === user._id.toString()
    ? res.json({ message: "contact deleted" })
    : res.status(404).json({ message: "Not Found" });
};

const update = async (req, res, next) => {
  const {
    body,
    user,
    params: { contactId: id },
  } = req;

  const contact = await updateContact(id, body);

  return contact && contact.owner._id.toString() === user._id.toString()
    ? res.json({ message: "success", data: contact })
    : res.status(404).json({ message: "Not found" });
};

const setStatus = async (req, res, next) => {
  const {
    body,
    user,
    params: { contactId: id },
  } = req;
  const { favorite } = body;
  if (!favorite) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  const contact = await updateContactStatus(id, { favorite });

  return contact && contact.owner._id.toString() === user._id.toString()
    ? res.json({ message: "success", data: contact })
    : res.status(404).json({ message: "Not Found" });
};

module.exports = { getAll, getById, create, remove, update, setStatus };