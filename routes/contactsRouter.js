import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactNew,
  updateStatusContact
} from "../controllers/contactsControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware, getAllContacts);

contactsRouter.get("/:id", authMiddleware, getOneContact);

contactsRouter.delete("/:id", authMiddleware, deleteContact);

contactsRouter.post("/", authMiddleware, createContact);

contactsRouter.put("/:id", authMiddleware, updateContactNew);

contactsRouter.patch("/:contactId/favorite", authMiddleware, updateStatusContact);

export default contactsRouter;