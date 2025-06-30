import express from "express";
import {
  addEvent,
  getEvents,
  joinEvent,
  myEvents,
  deleteEvent,
  updateEvent,
} from "../controllers/eventController";
import { protect } from "../middlewares/auth";

const router = express.Router();

router.get("/", getEvents);
router.post("/", protect, addEvent);
router.get("/my", protect, myEvents);
router.post("/join/:id", joinEvent);
router.delete("/:id", protect, deleteEvent);
router.put("/:id", protect, updateEvent);

export default router;
