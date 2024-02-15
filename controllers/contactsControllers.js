import { listContacts, getContactById, removeContact, addContact } from "../services/contactsServices.js";

import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsServices.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsServices.getContactById(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsServices.removeContact(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = createContactSchema.validate({ name, email, phone });
    if (error) {
      throw HttpError(400, error.message);
    }
    const newContact = await contactsServices.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    if (!name && !email && !phone) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const contact = await contactsServices.getContactById(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    const updatedContact = await contactsServices.updateContact(id, { name, email, phone });
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};
