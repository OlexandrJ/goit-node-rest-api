import express from 'express';
import { registerUser, loginUser } from '../controllers/usersControllers.js';
import validateBody from '../helpers/validateBody.js';

import { registrationSchema, loginSchema } from "../schemas/userSchemas.js";

const usersRouter = express.Router();

usersRouter.post('/register', validateBody(registrationSchema), registerUser);
usersRouter.post('/login', validateBody(loginSchema), loginUser);

export default usersRouter;
