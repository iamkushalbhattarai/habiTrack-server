import mongoose from "mongoose";
const { Schema, model } = mongoose;

const tokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    expiresIn: { type: Date, required: true },
    // createdByIp: { type: String, required: true }, // removed for now
  },
  {
    timestamps: true,
  }
);

const Token = model("Token", tokenSchema);

export default Token;
