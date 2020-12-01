import { Application } from "./deps.js";
//import { router } from "./routes/routes.js";
import * as middleware from './middlewares/middlewares.js';

const app = new Application();

// Middlewares

app.use(middleware.errorMiddleware);
app.use(middleware.requestTimingMiddleware);
app.use(middleware.serveStaticFilesMiddleware);

//Routes

//app.use(router.routes());

app.listen({ port: 7777 });