import * as reportService from "../../services/reportService.js";

const getWeekly = async ({ response }) => {
  const weeklyResults = await reportService.queryWeekly(new Date().toISOString().substring(0, 10));

  if (weeklyResults) {
    response.body = weeklyResults;
    response.status = 200; 
  } else {
    response.status = 401;
  }
  };

  const getDaily = async ({ response, params }) => {
    const date = new Date(Number(params.year), Number(params.month) - 1, Number(params.day) + 1).toISOString().substring(0, 10)
    const dailyResults = await reportService.queryDaily(date);
    if (dailyResults) {
      response.body = dailyResults;
      response.status = 200;
    } else {
      response.status = 401;
    }
  };

  export { getWeekly, getDaily };
