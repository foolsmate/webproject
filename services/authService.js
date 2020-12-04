import { executeQuery } from "../database/database.js";

const existingUsers = async (email) => {
  const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", email);
  return existingUsers;
}

const createUser = async (email, hash) => {
  await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
}

export { existingUsers, createUser }