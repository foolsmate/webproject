import { Router } from "../deps.js";
import { showLogin } from "./controllers/authController.js";
import { showReportForm, showMorningForm, showEveningForm } from "./controllers/reportController.js";
import { reportMorning } from "../services/reportService.js"

const router = new Router();

router.get('/auth/login', showLogin);
router.get('/behavior/reporting', showReportForm);
router.get('/behavior/reporting/morning', showMorningForm);
router.post('/behavior/reporting/morning', reportMorning);
router.get('/behavior/reporting/evening', showEveningForm);


export { router };