import type { Request, Response } from "express";
import Event from "../models/Event";
import type { AuthRequest } from "../middlewares/auth";

export const addEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, name, dateTime, location, description } = req.body;
    const event = await Event.create({
      title,
      name,
      dateTime,
      location,
      description,
      userId: req.user._id,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error creating event" });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ dateTime: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

export const joinEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    event.attendeeCount += 1;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error joining event" });
  }
};

export const myEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ userId: req.user._id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my events" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error updating event" });
  }
};
