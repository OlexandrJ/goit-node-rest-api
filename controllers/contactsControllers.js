import { listContacts, getContactById, removeContact, addContact, updateContact } from "../services/contactsServices.js";

import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error).json({ message: "Server error" });
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await removeContact(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = createContactSchema.validate({ name, email, phone });
    if (error) {
      throw HttpError(400, error.message);
    }
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContactNew = async (req, res, next) => {
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
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    const updatedContact = await updateContact(id, { name, email, phone });
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};
