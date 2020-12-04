import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { validate, required, isEmail, minLength } from "https://deno.land/x/validasaur@v0.15.0/mod.ts";
import { createUser, existingUsers } from "../../services/authService.js";

const showLogin = async ({ render }) => {
  render('login.ejs');
};

const showRegister = async ({ render }) => {
  render('register.ejs', { errors: [], email: "", notif: '' });
};

const register = async ({ request, response, session, render }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get('email');
  const password = params.get('password');
  const verification = params.get('verification');

  const obj = {
    email: email,
    password: password
  }

  const validationRules = {
    email: [required, isEmail],
    password: [required, minLength(4)],
  };

  const [passes, errors] = await validate(obj, validationRules);

  const users = await existingUsers(email);

  if (passes) {

    if (users.rowCount > 0) {
      render('register.ejs', { errors: [], email: email, notif: 'The email is already reserved.' });
      return
    }

    if (password !== verification) {
      render('register.ejs', { errors: [], email: email, notif: 'The entered passwords did not match' });
      return
    }

    const hash = await bcrypt.hash(password);

    createUser(email, hash);

    render('register.ejs', { errors: errors, email: "", notif: 'Success!' });
  } else {
    render('register.ejs', { errors: errors, email: email, notif: '' });
  }

};


export { showLogin, showRegister, register };