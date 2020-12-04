import { createSummary } from '../../services/reportService.js'

const showReportForm = async ({ render }) => {
  render('report.ejs');
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

const postSummary = async ({ render, request }) => {
  const body = request.body();
  const params = await body.value;

  const date = params.get('date');

  if (!date) {
    date = new Date().toISOString().substring(0, 10);
  }

  render('summary.ejs', { summary: await createSummary(date), date: date });
};


export { showReportForm, showEveningForm, showMorningForm, showSummary, postSummary };