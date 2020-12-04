import { Router } from "../deps.js";
import { showLogin, showRegister, register } from "./controllers/authController.js";
import { showReportForm, showMorningForm, showEveningForm, showSummary, postSummary} from "./controllers/reportController.js";
import { reportMorning, reportEvening } from "../services/reportService.js"
import { showMain } from "./controllers/titleController.js"

const router = new Router();

router.get('/auth/login', showLogin);
router.get('/auth/registration', showRegister)

router.post('/auth/registration', register)

router.get('/behavior/reporting', showReportForm);
router.get('/behavior/reporting/morning', showMorningForm);
router.get('/behavior/reporting/evening', showEveningForm);

router.post('/behavior/reporting/morning', reportMorning);
router.post('/behavior/reporting/evening', reportEvening);

router.get('/behavior/summary', showSummary);
router.post('/behavior/summary', postSummary);

router.get('/', showMain);

export { router };