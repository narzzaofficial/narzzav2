import { CounterModel } from "@/lib/models/Counter";

export async function getNextSequence(name: string): Promise<number> {
  const counter = await CounterModel.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  if (!counter) {
    throw new Error(`Failed to increment counter: ${name}`);
  }

  return counter.value;
}
