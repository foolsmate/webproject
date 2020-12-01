import { getReports } from "../../services/reportService.js";

const report = ({render}) => {
  render('index.ejs', { hello: getReports() });
};
 
export { report };