import { getMoods } from '../../services/titleService.js'

const showMain = async ({ render }) => {
  render('main.ejs', {moods: await getMoods() });
};

export { showMain };