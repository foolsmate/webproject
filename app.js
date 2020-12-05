import { Application, Session, engineFactory, adapterFactory, viewEngine } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from './middlewares/middlewares.js';

const app = new Application();

// Session

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

// Middlewares

app.use(middleware.errorMiddleware);
app.use(middleware.requestTimingMiddleware);
app.use(middleware.serveStaticFilesMiddleware);
app.use(middleware.authMiddleware);

// HTML and CSS rendering

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
  viewRoot: "./views"
}));

//Routes

app.use(router.routes());

app.listen({ port: 7777 });