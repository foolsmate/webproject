import { executeQuery } from "../database/database.js";
import { validate, required, isNumeric, maxNumber, minNumber } from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

const validationRules = {
  duration: [required, isNumeric, minNumber(0)],
  quality: [required, isNumeric, maxNumber(5), minNumber(1)],
  mood: [required, isNumeric, maxNumber(5), minNumber(1)],
};

const reportMorning = async ({ request, session, response, render }) => {

  const body = request.body();
  const params = await body.value;

  const date = params.get('date');
  const duration = params.get('duration');
  const quality = params.get('quality');
  const mood = params.get('mood');

  const data = {
    quality: Number(quality),
    duration: Number(duration),
    mood: Number(mood),
  };

  console.log(data);

  const [passes, errors] = await validate(data, validationRules);

  if (passes) {
    await executeQuery("INSERT INTO reports (time_of_day, date, sleep_duration, sleep_quality, mood, user_id) VALUES ('morning', $1, $2, $3, $4, $5) ", date, duration, quality, mood, 2);
    render("morning.ejs", { errors: [], success: true });
  } else {
    render("morning.ejs", { errors: errors, success: false });
  }
}

export { reportMorning };