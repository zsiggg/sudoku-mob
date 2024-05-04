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

export const addPuzzle = async (puzzle: string) => {
  const supabase = createClient();
  const { error } = await supabase.from('sudoku_puzzles').insert([{ puzzle }]);
  if (error) throw error;
};

export const checkIsPuzzleInDb = async (puzzle: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sudoku_puzzles')
    .select('puzzle')
    .eq('puzzle', puzzle)
    .limit(1);
  if (error) throw error;

  return data.length > 0;
};
