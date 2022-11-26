const fs = require("fs/promises");
const path = require("path");

const contactsData = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsData);
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await fs.readFile(contactsData);
  const [contact] = JSON.parse(contacts).filter((el) => el.id === contactId);
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await fs.readFile(contactsData);
  const filteredContacts = JSON.parse(contacts).filter(
    (el) => el.id !== contactId
  );
  if (filteredContacts.length !== contacts.length) {
    fs.writeFile(contactsData, JSON.stringify(filteredContacts), "utf-8");
    return filteredContacts;
  }
};

const addContact = async (body) => {
  const contacts = await fs.readFile(contactsData);
  const newContacts = [...JSON.parse(contacts), body];
  fs.writeFile(contactsData, JSON.stringify(newContacts), "utf-8");
  return body;
};

const updateContact = async (contactId, body) => {
  const contacts = await fs.readFile(contactsData);
  const uptatedContact = { id: contactId, ...body };
  const newContacts = JSON.parse(contacts).reduce((acc, contact) => {
    if (contact.id === contactId) {
      return [...acc, uptatedContact];
    }
    return [...acc, contact];
  }, []);
  fs.writeFile(contactsData, JSON.stringify(newContacts), "utf-8");
  return uptatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};