import express from "express";
import { login, updateprofile } from '../controllers/auth.js';

const routes = express.Router();

routes.post('/login', login);
routes.post('/update/:id', updateprofile);
export default routes;