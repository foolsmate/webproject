import { Router } from "../deps.js";
import { report } from "./controllers/reportController.js";

const router = new Router();

router.get('/', report);

export { router };