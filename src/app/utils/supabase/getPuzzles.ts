'use server';

import { createClient } from '@/app/utils/supabase/server';

export const getPuzzles = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sudoku_puzzles')
    .select('puzzle');
  if (error) throw error;

  return data.map((row) => row.puzzle);
};

export const getPuzzleCount = async () => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('sudoku_puzzles')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;

  return count;
};

export const getPuzzleIds = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('sudoku_puzzles').select('id');
  if (error) throw error;

  return data.map((row) => row.id);
};

export const getRandomPuzzleId = async () => {
  const ids = await getPuzzleIds();
  const i = Math.round(Math.random() * (ids.length - 1));

  return ids[i];
};

export const getPuzzle = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sudoku_puzzles')
    .select('puzzle')
    .eq('id', id)
    .limit(1);
  if (error) throw error;

  return data[0]['puzzle'];
};
