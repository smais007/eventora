import mongoose, { Schema, Document } from "mongoose";
import type { IUser } from "./User";

export interface IEvent extends Document {
  title: string;
  postedBy: mongoose.Schema.Types.ObjectId | IUser;
  date: Date;
  location: string;
  description: string;
  attendeeCount: number;
  attendees: mongoose.Schema.Types.ObjectId[];
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  attendeeCount: { type: Number, default: 0 },
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IEvent>("Event", EventSchema);
