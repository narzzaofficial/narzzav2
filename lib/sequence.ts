import { CounterModel } from "@/lib/models/Counter";

async function ensureSequenceAtLeast(name: string, floorValue: number): Promise<void> {
  if (floorValue <= 0) return;

  await CounterModel.findOneAndUpdate(
    { name },
    { $max: { value: floorValue } },
    { upsert: true, setDefaultsOnInsert: true, returnDocument: "after" }
  ).lean();
}

export async function getNextSequence(name: string, floorValue = 0): Promise<number> {
  await ensureSequenceAtLeast(name, floorValue);

  const counter = await CounterModel.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    { upsert: true, setDefaultsOnInsert: true, returnDocument: "after" }
  ).lean();

  if (!counter) {
    throw new Error(`Failed to increment counter: ${name}`);
  }

  return counter.value;
}
