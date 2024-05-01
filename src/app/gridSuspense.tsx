import { getRandomPuzzle } from './getPuzzles';
import Grid from './grid';

const GridSuspense = () => {
  return getRandomPuzzle().then((puzzle) => <Grid puzzle={puzzle} />);
};

export default GridSuspense;
