import mongoose, { model, models, Schema } from "mongoose";

export interface ICounter {
  name: string;
  value: number;
}

const CounterSchema = new Schema<ICounter>(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true, default: 0 },
  },
  { versionKey: false }
);

export const CounterModel =
  (models.Counter as mongoose.Model<ICounter>) ||
  model<ICounter>("Counter", CounterSchema);
