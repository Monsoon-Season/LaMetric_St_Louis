import { Router } from "express";
import { getResponse } from "../services/cardinals.service";

const ApiController: Router = Router();
ApiController.get('/', getResponse);
export default ApiController;
