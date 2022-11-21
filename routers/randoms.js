import express from "express";
import { randomsGenerarController, randomsInitController } from "../controllers/randoms_controller.js";

export const randoms = express.Router()


randoms.get("/",randomsInitController)
  
randoms.post("/",randomsGenerarController);
  
  