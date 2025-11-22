import { Router } from "express";
import { getSuggestions, createSuggestion } from "../controllers/suggestions.controller.js";

const router = Router();

router.get("/", getSuggestions);
router.post("/", createSuggestion);

export default router;
