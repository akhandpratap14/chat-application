import { Router } from "express";
import { prisma } from "../database/prisma.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { userId, name } = req.body;

    const room = await prisma.room.create({
      data: {
        name: name ?? "New Room",
        users: [userId], 
      },
    });

    res.json(room);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create room" });
  }
});

router.get("/", async (req, res) => {
  const userId = req.query.userId?.toString();

  if (!userId) return res.status(400).json({ error: "userId is required" });

  const rooms = await prisma.room.findMany({
    where: {
      users: { has: userId },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(rooms);
});

router.post("/join", async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.users.includes(userId)) {
      return res.json(room);
    }

    const updated = await prisma.room.update({
      where: { id: roomId },
      data: {
        users: [...room.users, userId],
      },
    });

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to join room" });
  }
});



export default router;
