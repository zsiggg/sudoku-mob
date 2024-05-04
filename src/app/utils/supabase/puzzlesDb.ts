'use server';

import { createClient } from '@/app/utils/supabase/createSupabaseClient/server';

export const getPuzzleIds = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sudoku_puzzles')
    .select('id')
    .order('row_num', { ascending: true });
  if (error) throw error;

  return data.map((row) => row.id);
};

export const getRandomPuzzleId = async () => {
  const ids = await getPuzzleIds();
  const i = Math.round(Math.random() * (ids.length - 1));

  return ids[i];
};

export const getPuzzleAndMinMoves = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sudoku_puzzles')
    .select('puzzle, min_moves')
    .eq('id', id)
    .limit(1);
  if (error) throw error;

  return data[0];
};

export const addPuzzleAndMinMoves = async (
  puzzle: string,
  min_moves: number,
) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('sudoku_puzzles')
    .insert([{ puzzle, min_moves }]);
  if (error) throw error;
};

export const getPuzzleId = async (puzzle: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sudoku_puzzles')
    .select('id')
    .eq('puzzle', puzzle)
    .limit(1);
  if (error) throw error;

  return data[0]?.id;
};

export const updateMinMoves = async (id: string, moveCount: number) => {
  const supabase = createClient();

  // todo: return if min_moves is updated in a better way
  const { data, error: selectError } = await supabase
    .from('sudoku_puzzles')
    .select('min_moves')
    .eq('id', id);
  if (selectError) throw selectError;

  const { min_moves: currMinMoves } = data[0];

  if (currMinMoves === null || moveCount < currMinMoves) {
    const { error: updateError } = await supabase
      .from('sudoku_puzzles')
      .update({ min_moves: moveCount })
      .eq('id', id)
      .or(`min_moves.is.null, min_moves.gt.${moveCount}`);
    // .select();
    // .select() not working to get updated record when chained after .or()
    if (updateError) throw updateError;

    return true;
  } else {
    return false;
  }
};
