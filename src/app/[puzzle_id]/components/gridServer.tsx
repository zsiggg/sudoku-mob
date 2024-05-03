import { getPuzzle } from '../../utils/supabase/getPuzzles';
import GridClient from './gridClient';

const GridServer = ({ puzzle_id }: { puzzle_id: string }) => {
  return getPuzzle(puzzle_id).then((puzzle) => (
    <GridClient puzzle={puzzle} puzzle_id={puzzle_id} />
  ));
};

export default GridServer;
