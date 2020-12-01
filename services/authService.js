import { executeQuery } from "../database/database.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

const auth = async ({ request, response, session }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get('email');
  const password = params.get('password');

  // check if the email exists in the database
  const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
  if (res.rowCount === 0) {
    response.status = 401;
    return;
  }

  // take the first row from the results
  const userObj = res.rowsOfObjects()[0];

  const hash = userObj.password;

  const passwordCorrect = await bcrypt.compare(password, hash);
  if (!passwordCorrect) {
    response.status = 401;
    return;
  }

  await session.set('authenticated', true);
  await session.set('user', {
    id: userObj.id,
    email: userObj.email
  });
  response.body = 'Authentication successful!';
}
export { auth };