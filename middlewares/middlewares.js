import { send } from '../deps.js';


const errorMiddleware = async (context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const authMiddleware = async ({ request, response, session }, next) => {
  if (request.url.pathname.startsWith('/behavior')
    && !request.url.pathname.startsWith('/api')
    && !request.url.pathname.startsWith('/auth')
    && request.url.pathname !== '/') {
    if (session && await session.get('authenticated')) {
      await next();
    } else {
      response.redirect('/auth/login');
    }
  } else {
    await next();
  }
};

const requestTimingMiddleware = async ({ request, session }, next) => {
  const today = new Date();
  var dateTime = today.toLocaleTimeString() + ' ' + today.toLocaleDateString();
  let authenticated = await session.get('authenticated');
  if (authenticated) {
    const userId = (await session.get('user')).id;
    console.log(`${dateTime} ${request.method} ${request.url.pathname} ${userId}`);
  } else {
    console.log(`${dateTime} ${request.method} ${request.url.pathname}`);
  }
  await next();
}

const serveStaticFilesMiddleware = async (context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);

    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });

  } else {
    await next();
  }
}

export { errorMiddleware, requestTimingMiddleware, serveStaticFilesMiddleware, authMiddleware };