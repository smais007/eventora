import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  name: string;
  dateTime: Date;
  location: string;
  description: string;
  attendeeCount: number;
  userId: string;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  name: { type: String, required: true },
  dateTime: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  attendeeCount: { type: Number, default: 0 },
  userId: { type: String, required: true },
});

export default mongoose.model<IEvent>("Event", EventSchema);
