import { Router } from "express";
import { prisma } from "../database/prisma.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { roomId, senderId, tokens } = req.body;
    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }
    const message = await prisma.message.create({
      data: {
        roomId,
        senderId,
        content: tokens,
      },
    });
    req.app.get("io").to(roomId).emit("newMessage", message);
    res.json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.get("/", async (req, res) => {
  const roomId = req.query.roomId?.toString();

  if (!roomId) {
    return res.status(400).json({ error: "roomId is required" });
  }

  const messages = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
  });

  res.json(messages);
});


export default router;
