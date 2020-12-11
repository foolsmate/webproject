import { createSummary, queryMorning, queryEvening, queryDaily } from '../../services/reportService.js'
import { validate, required, isNumeric, maxNumber, minNumber } from "https://deno.land/x/validasaur@v0.15.0/mod.ts";


const showReportForm = async ({ render, session }) => {

  let eveningReported, morningReported = false;

  const user_id = (await session.get('user')).id;

  const values = await queryDaily(new Date().toISOString().substring(0, 10), user_id);

  if (typeof Number(values.avg_slp_number) === 'number' && typeof Number(values.avg_slp_ql) === 'number' && typeof Number(values.mood) === 'number') {
    morningReported = true;
  }

  if (typeof Number(values.sports) === 'number' && typeof Number(values.studying) === 'number' && typeof Number(values.eating) === 'number' && typeof Number(values.mood) === 'number') {
    eveningReported = true;
  }

  render('report.ejs', { eveningReported, morningReported });
};

const showEveningForm = async ({ render }) => {
  render('evening.ejs', { errors: [], success: false, sports: 0, study: 0, eating: 3, mood: 3, date: new Date().toISOString().substring(0, 10) });
};

const showMorningForm = async ({ render }) => {
  render('morning.ejs', { errors: [], success: false, duration: 0, quality: 3, mood: 3, date: new Date().toISOString().substring(0, 10) });
};

const showSummary = async ({ render }) => {
  const date = new Date().toISOString().substring(0, 10);

  render('summary.ejs', { summary: await createSummary(date), date: date });
};

const reportMorning = async ({ render, request, response, session }) => {
  const body = request.body();
  const params = await body.value;
  const user_id = (await session.get('user')).id;

  const date = params.get('date');
  const duration = params.get('duration');
  const quality = params.get('quality');
  const mood = params.get('mood');

  const data = {
    date: date,
    quality: Number(quality),
    duration: Number(duration),
    mood: Number(mood),
  };

  const validationRules = {
    duration: [required, isNumeric, minNumber(0)],
    quality: [required, isNumeric, maxNumber(5), minNumber(1)],
    mood: [required, isNumeric, maxNumber(5), minNumber(1)],
  };

  const [passes, errors] = await validate(data, validationRules);

  if (passes) {
    await queryMorning(data, user_id);
    render("morning.ejs", { errors: [], success: true, duration: 0, quality: 3, mood: 3, date: new Date().toISOString().substring(0, 10) });
  } else {
    render("morning.ejs", { errors: errors, success: false, quality: data.quality, duration: data.duration, mood: data.mood, date: date });
  }
}

const reportEvening = async ({ render, request, response, session }) => {

  const body = request.body();
  const params = await body.value;
  const user_id = (await session.get('user')).id;

  const date = params.get('date');
  const sports = params.get('sports');
  const study = params.get('study');
  const eating = params.get('eating');
  const mood = params.get('mood');

  const data = {
    date: date,
    sports: Number(sports),
    study: Number(study),
    eating: Number(eating),
    mood: Number(mood)
  };

  const validationRulesEvening = {
    sports: [required, isNumeric, minNumber(0)],
    study: [required, isNumeric, minNumber(0)],
    eating: [required, isNumeric, maxNumber(5), minNumber(1)],
    mood: [required, isNumeric, maxNumber(5), minNumber(1)],
  };

  const [passes, errors] = await validate(data, validationRulesEvening);

  if (passes) {
    await queryEvening(data, user_id);
    render('evening.ejs', { errors: [], success: true, sports: 0, study: 0, eating: 3, mood: 3, date: new Date().toISOString().substring(0, 10) });
  } else {
    render('evening.ejs', { errors: errors, success: false, sports: data.sports, study: data.study, eating: data.eating, mood: data.mood, date: date });
  }
}

const postSummary = async ({ render, request, session }) => {
  const body = request.body();
  const params = await body.value;

  const userId = (await session.get('user')).id;

  const date = params.get('date');

  if (!date) {
    date = new Date().toISOString().substring(0, 10);
  }

  render('summary.ejs', { summary: await createSummary(date, userId), date: date });
};


export { showReportForm, showEveningForm, showMorningForm, showSummary, postSummary, reportMorning, reportEvening };