import { executeQuery } from "../database/database.js";

const getReports = async ({render, session}) => {
  const res = await executeQuery("SELECT * FROM reports ORDER BY id DESC LIMIT 1");
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0].message;
  }

  return 'No messages available';
}

const setReport = async ({request, session, response}) => {
  await executeQuery("INSERT INTO reports (message, sender) VALUES ($1, 'API');", newMessage);
}

export { getReports, setReport };