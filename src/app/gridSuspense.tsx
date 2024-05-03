import { getPuzzle } from './getPuzzles';
import Grid from './grid';

const GridSuspense = ({ puzzle_id }: { puzzle_id: string }) => {
  return getPuzzle(puzzle_id).then((puzzle) => (
    <Grid puzzle={puzzle} puzzle_id={puzzle_id} />
  ));
};

export default GridSuspense;
