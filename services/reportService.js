import { executeQuery } from "../database/database.js";

const createSummary = async (date, user_id) => {

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
  ) AS avg_studying ", dates.start_date, dates.end_date, user_id);

  const res3 = await executeQuery("SELECT (date_trunc('month', $1::date) + interval '1 month' - interval '1 day')::date \
  AS end_of_month, (SELECT date_trunc('month', $1::timestamp) + interval '1 day') AS start_of_month", date);

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
  ) AS avg_mo_studying ", monthDates.start_of_month.toISOString().substring(0, 10), monthDates.end_of_month.toISOString().substring(0, 10), user_id);

  const summary = {
    ...res2.rowsOfObjects()[0],
    ...res4.rowsOfObjects()[0]
  }

  if (res && res.rowCount > 0 && res2 && res2.rowCount > 0 && res3 && res3.rowCount > 0 && res4 && res4.rowCount > 0) {
    return summary;
  }
  return null;
}

const queryWeekly = async (date) => {

  const res = await executeQuery("SELECT (date_trunc('week', $1::timestamp) + '7 days'::interval) AS end_date,\
   (SELECT date_trunc('week', $1::timestamp)) AS start_date", date);

  const dates = res.rowsOfObjects()[0]

  const res2 = await executeQuery("SELECT avg(sleep_duration) as avg_slp_dur, avg(mood) as mood, avg(sleep_quality) as avg_slp_ql, avg(sports) as sports, avg(studying) as studying, avg(eating) as eating FROM reports WHERE date BETWEEN $1 and $2", dates.start_date, dates.end_date);

  if (res2 && res2.rowCount > 0) {
    return res2.rowsOfObjects();
  } else {
    return null;
  }
}

const queryDaily = async (date, user_id) => {

  let res = await executeQuery("SELECT avg(sleep_duration) as avg_slp_dur, avg(mood) as mood, avg(sleep_quality) as avg_slp_ql, avg(sports) as sports, avg(studying) as studying, avg(eating) as eating FROM reports WHERE date = $1", date);

  if (user_id) {
    res = await executeQuery("SELECT avg(sleep_duration) as avg_slp_dur, avg(mood) as mood, avg(sleep_quality) as avg_slp_ql, avg(sports) as sports, avg(studying) as studying, avg(eating) as eating FROM reports WHERE date = $1 and user_id= $2", date, user_id);
  }

  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  } else {
    return null;
  }
}


const queryMorning = async (data, user_id) => {

  const res = await executeQuery("SELECT * FROM reports WHERE date = $1 and user_id = $2", data.date, user_id);

  if (res.rowCount === 0 || !res) {
    await executeQuery("INSERT INTO reports (time_of_day, date, sleep_duration, sleep_quality, mood, user_id) VALUES ('morning', $1, $2, $3, $4, $5) ", data.date, data.duration, data.quality, data.mood, user_id);
  } else {
    await executeQuery("DELETE FROM reports WHERE date = $1 and user_id = $2", data.date, user_id);
    await executeQuery("INSERT INTO reports (time_of_day, date, sports, studying, eating, mood, sleep_duration, sleep_quality, user_id) VALUES ('morning', $1, $2, $3, $4, $5, $6, $7, $8) ", data.date, Number(res.rowsOfObjects()[0].sports), Number(res.rowsOfObjects()[0].studying), Number(res.rowsOfObjects()[0].eating), data.mood, data.duration, data.quality, user_id);
  }
}

const queryEvening = async (data, user_id) => {

  const res = await executeQuery("SELECT * FROM reports WHERE date = $1 and user_id = $2", data.date, user_id);
  if (res.rowCount === 0 || !res) {
    await executeQuery("INSERT INTO reports (time_of_day, date, sports, studying, eating, mood, user_id) VALUES ('evening', $1, $2, $3, $4, $5, $6) ", data.date, data.sports, data.study, data.eating, data.mood, user_id);
  } else {
    await executeQuery("DELETE FROM reports WHERE date = $1 and user_id = $2", data.date, user_id);
    await executeQuery("INSERT INTO reports (time_of_day, date, sports, studying, eating, mood, sleep_duration, sleep_quality, user_id) VALUES ('evening', $1, $2, $3, $4, $5, $6, $7, $8) ", data.date, data.sports, data.study, data.eating, data.mood, Number(res.rowsOfObjects()[0].sleep_duration), res.rowsOfObjects()[0].sleep_quality, user_id);
  }

}

export { createSummary, queryMorning, queryEvening, queryWeekly, queryDaily };