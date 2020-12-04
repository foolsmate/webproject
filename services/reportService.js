import { executeQuery } from "../database/database.js";
import { validate, required, isNumeric, maxNumber, minNumber } from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

const validationRules = {
  duration: [required, isNumeric, minNumber(0)],
  quality: [required, isNumeric, maxNumber(5), minNumber(1)],
  mood: [required, isNumeric, maxNumber(5), minNumber(1)],
};

const validationRulesEvening = {
  sports: [required, isNumeric, minNumber(0)],
  study: [required, isNumeric, minNumber(0)],
  eating: [required, isNumeric, maxNumber(5), minNumber(1)],
  mood: [required, isNumeric, maxNumber(5), minNumber(1)],
};

const createSummary = async (date) => {

  const res = await executeQuery("SELECT (date_trunc('week', $1::timestamp) + '7 days'::interval) AS end_date,\
   (SELECT date_trunc('week', $1::timestamp)) AS start_date", date);

  const dates = res.rowsOfObjects()[0]

  const res2 = await executeQuery("SELECT  (\
    SELECT avg(mood) \
    FROM   reports \
    WHERE date BETWEEN $1 and $2 \
    AND user_id = $3 \
  ) AS avg_mood, \
  ( SELECT avg(sleep_duration) \
  FROM   reports \
  WHERE date BETWEEN $1 and $2 \
  AND user_id = $3 \
  ) AS avg_sleep_duration, \
  ( SELECT avg(sports) \
  FROM   reports \
  WHERE date BETWEEN $1 and $2 \
  AND user_id = $3 \
  ) AS avg_sports, \
  ( SELECT avg(sleep_quality) \
  FROM   reports \
  WHERE date BETWEEN $1 and $2 \
  AND user_id = $3 \
  ) AS avg_sleep_quality, \
  ( SELECT avg(studying) \
  FROM   reports \
  WHERE date BETWEEN $1 and $2 \
  AND user_id = $3 \
  ) AS avg_studying ", dates.start_date, dates.end_date, 2);

  const res3 = await executeQuery("SELECT (date_trunc('month', $1::date) + interval '1 month' - interval '1 day')::date \
  AS end_of_month, (SELECT date_trunc('month', $1::timestamp)) AS start_of_month", date);

  const monthDates = res3.rowsOfObjects()[0];

  const res4 = await executeQuery("SELECT  (\
    SELECT avg(mood) \
    FROM   reports \
    WHERE date BETWEEN $1 and $2 \
    AND user_id = $3 \
  ) AS avg_mo_mood, \
  ( SELECT avg(sleep_duration) \
  FROM   reports \
  WHERE date BETWEEN $1 and $2 \
  AND user_id = $3 \
  ) AS avg_mo_sleep_duration, \
  ( SELECT avg(sports) \
  FROM   reports \
  WHERE date BETWEEN $1 and $2 \
  AND user_id = $3 \
  ) AS avg_mo_sports, \
  ( SELECT avg(sleep_quality) \
  FROM   reports \
  WHERE date BETWEEN $1 and $2 \
  AND user_id = $3 \
  ) AS avg_mo_sleep_quality, \
  ( SELECT avg(studying) \
  FROM   reports \
  WHERE date BETWEEN $1 and $2 \
  AND user_id = $3 \
  ) AS avg_mo_studying ", monthDates.start_of_month, monthDates.end_of_month, 2);

  const summary = {
    ...res2.rowsOfObjects()[0],
    ...res4.rowsOfObjects()[0]
  }

  if (res && res.rowCount > 0 && res2 && res2.rowCount > 0 && res3 && res3.rowCount > 0 && res4 && res4.rowCount > 0) {
    return summary;
  }
  return null;
}

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

  const [passes, errors] = await validate(data, validationRules);

  if (passes) {
    const res = await executeQuery("SELECT * FROM reports WHERE date = $1 and user_id = $2", date, 2);
    if (res.rowCount === 0 || !res) {
      await executeQuery("INSERT INTO reports (time_of_day, date, sleep_duration, sleep_quality, mood, user_id) VALUES ('morning', $1, $2, $3, $4, $5) ", date, duration, quality, mood, 2);
      render("morning.ejs", { errors: [], success: true, duration: 0, quality: 3, mood: 3, date: new Date().toISOString().substring(0, 10) });
    } else {
      await executeQuery("DELETE FROM reports WHERE date = $1 and user_id = $2", date, 2);
      await executeQuery("INSERT INTO reports (time_of_day, date, sports, studying, eating, mood, sleep_duration, sleep_quality, user_id) VALUES ('morning', $1, $2, $3, $4, $5, $6, $7, $8) ", date, Number(res.rowsOfObjects()[0].sports), Number(res.rowsOfObjects()[0].studying), Number(res.rowsOfObjects()[0].eating), mood, duration, quality, 2);
      render("morning.ejs", { errors: [], success: true, duration: 0, quality: 3, mood: 3, date: new Date().toISOString().substring(0, 10) });
    }
  } else {
    render("morning.ejs", { errors: errors, success: false, quality: data.quality, duration: data.duration, mood: data.mood, date: date });
  }
}

const reportEvening = async ({ request, session, response, render }) => {

  const body = request.body();
  const params = await body.value;

  const date = params.get('date');
  const sports = params.get('sports');
  const study = params.get('study');
  const eating = params.get('eating');
  const mood = params.get('mood');

  const data = {
    sports: Number(sports),
    study: Number(study),
    eating: Number(eating),
    mood: Number(mood)
  };

  const [passes, errors] = await validate(data, validationRulesEvening);

  if (passes) {
    const res = await executeQuery("SELECT * FROM reports WHERE date = $1 and user_id = $2", date, 2);
    if (res.rowCount === 0 || !res) {
      await executeQuery("INSERT INTO reports (time_of_day, date, sports, studying, eating, mood, user_id) VALUES ('evening', $1, $2, $3, $4, $5, $6) ", date, sports, study, eating, mood, 2);
      render('evening.ejs', { errors: [], success: true, sports: 0, study: 0, eating: 3, mood: 3, date: new Date().toISOString().substring(0, 10) });
    } else {
      await executeQuery("DELETE FROM reports WHERE date = $1 and user_id = $2", date, 2);
      await executeQuery("INSERT INTO reports (time_of_day, date, sports, studying, eating, mood, sleep_duration, sleep_quality, user_id) VALUES ('evening', $1, $2, $3, $4, $5, $6, $7, $8) ", date, sports, study, eating, mood, Number(res.rowsOfObjects()[0].sleep_duration), res.rowsOfObjects()[0].sleep_quality, 2);
      render('evening.ejs', { errors: [], success: true, sports: 0, study: 0, eating: 3, mood: 3, date: new Date().toISOString().substring(0, 10) });
    }
  } else {
    render('evening.ejs', { errors: errors, success: false, sports: data.sports, study: data.study, eating: data.eating, mood: data.mood, date: date });
  }
}

export { reportMorning, createSummary, reportEvening };