import { getPuzzle, getRandomPuzzle } from './getPuzzles';
import Grid from './grid';

const GridSuspense = ({ puzzle_id }: { puzzle_id?: string }) => {
  if (puzzle_id) {
    return getPuzzle(puzzle_id).then((puzzle) => (
      <Grid puzzle={puzzle} puzzle_id={puzzle_id} />
    ));
  } else {
    return getRandomPuzzle().then((puzzle) => <Grid puzzle={puzzle} />);
  }
};

export default GridSuspense;
