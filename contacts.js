import { promises as fs } from "fs";
import shortid from "shortid";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactsPath = path.join(__dirname, "db", "contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  } catch (error) {
    throw new Error(`Error reading contacts: ${error.message}`);
  }
};

const getContactById = async (id) => {
  try {
    const allContacts = await listContacts();
    return allContacts.find((contact) => contact.id === id);
  } catch (error) {
    throw new Error(`Error getting contact by ID: ${error.message}`);
  }
};

const removeContact = async (id) => {
  try {
    let allContacts = await listContacts();
    const removedContact = allContacts.find((contact) => contact.id === id);
    if (!removedContact) {
      return `Contact with id ${id} does not exist.`;
    }
    allContacts = allContacts.filter((contact) => contact.id !== id);
    await fs.writeFile(
      contactsPath,
      JSON.stringify(allContacts, null, 2),
      "utf-8"
    );
    return `Contact '${removedContact.name}' has been successfully removed.`;
  } catch (error) {
    throw new Error(`Error removing contact: ${error.message}`);
  }
};

const addContact = async (name, email, phone) => {
  try {
    let allContacts = await listContacts();
    const newContact = { id: shortid.generate(), name, email, phone };
    allContacts.push(newContact);
    await fs.writeFile(
      contactsPath,
      JSON.stringify(allContacts, null, 2),
      "utf-8"
    );
    return newContact;
  } catch (error) {
    throw new Error(`Error adding contact: ${error.message}`);
  }
};

export { listContacts, getContactById, removeContact, addContact };
