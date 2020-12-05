import { Router } from "../deps.js";
import { showLogin, showRegister, register, authenticate } from "./controllers/authController.js";
import {
  showReportForm, showMorningForm, showEveningForm,
  showSummary, postSummary, reportMorning, reportEvening
} from "./controllers/reportController.js";
import { showMain } from "./controllers/titleController.js"

const router = new Router();

router.get('/auth/login', showLogin);
router.get('/auth/registration', showRegister)

router.post('/auth/registration', register)
router.post('/auth/login', authenticate)

router.get('/behavior/reporting', showReportForm);
router.get('/behavior/reporting/morning', showMorningForm);
router.get('/behavior/reporting/evening', showEveningForm);

router.post('/behavior/reporting/morning', reportMorning);
router.post('/behavior/reporting/evening', reportEvening);

router.get('/behavior/summary', showSummary);
router.post('/behavior/summary', postSummary);

router.get('/', showMain);

export { router };