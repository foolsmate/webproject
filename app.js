import { Application, Session, engineFactory, adapterFactory, viewEngine } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from './middlewares/middlewares.js';

const app = new Application();

// Middlewares

app.use(middleware.errorMiddleware);
app.use(middleware.requestTimingMiddleware);
app.use(middleware.serveStaticFilesMiddleware);

// Session

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

const hash = await bcrypt.hash("banana");
console.log(hash)

// HTML and CSS rendering

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
  viewRoot: "./views"
}));

//Routes

app.use(router.routes());

app.listen({ port: 7777 });