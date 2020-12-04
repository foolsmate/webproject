import { executeQuery } from "../database/database.js";
import { parse } from 'https://deno.land/std@0.69.0/datetime/mod.ts'

const getMoods = async () => {

  const today = new Date().toISOString().substring(0, 10);
  const r = await executeQuery("SELECT * from reports WHERE date = $1 and user_id = $2", today, 2);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const r2 = await executeQuery("SELECT * from reports WHERE date = $1 and user_id = $2", yesterday.toISOString().substring(0, 10), 2);

  const moodToday = Number(r.rowsOfObjects()[0].mood);
  const moodYesterday = Number(r2.rowsOfObjects()[0].mood);

  const obj = {
    moodToday: moodToday,
    moodYesterday: moodYesterday
  }

  return obj;
}

export { getMoods };