
const showReportForm = ({ render }) => {
  render('report.ejs');
};

const showEveningForm = ({ render }) => {
  render('evening.ejs');
};

const showMorningForm = ({ render }) => {
  render('morning.ejs', { errors: [], success: false });
};


export { showReportForm, showEveningForm, showMorningForm };