import { Request, Response } from "express";
import { searchSuggestions, addSuggestion } from "../services/suggestions.service.js";

export async function getSuggestions(req: Request, res: Response) {
  const search = req.query.search as string;

  if (!search || search.trim() === "") {
    return res.json([]);
  }

  const result = await searchSuggestions(search);
  return res.json(result);
}

export async function createSuggestion(req: Request, res: Response) {
  const { label } = req.body;

  if (!label) {
    return res.status(400).json({ error: "Label is required" });
  }

  const created = await addSuggestion(label);
  return res.json(created);
}
