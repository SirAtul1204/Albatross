import { Schema, model } from "mongoose";

const Detail = new Schema({
  guildId: { type: String, required: true, unique: true },
  volume: { type: Number, required: true, default: 1 },
});

export const DetailsModel = model("detail", Detail);
