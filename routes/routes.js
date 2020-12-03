import { Router } from "../deps.js";
import { showLogin } from "./controllers/authController.js";
import { showReportForm, showMorningForm, showEveningForm, showSummary, postSummary} from "./controllers/reportController.js";
import { reportMorning } from "../services/reportService.js"

const router = new Router();

router.get('/auth/login', showLogin);
router.get('/behavior/reporting', showReportForm);
router.get('/behavior/reporting/morning', showMorningForm);
router.post('/behavior/reporting/morning', reportMorning);
router.get('/behavior/reporting/evening', showEveningForm);
router.get('/behavior/summary', showSummary);
router.post('/behavior/summary', postSummary);

export { router };