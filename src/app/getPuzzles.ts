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

export const getRandomPuzzle = async () => {
  const count = (await getPuzzleCount()) ?? 0;
  const idx = Math.round(Math.random() * (count - 1));

  const supabase = createClient();
  const { data, error } = await supabase
    .from('sudoku_puzzles')
    .select('puzzle')
    .range(idx, idx);
  if (error) throw error;

  return data[0].puzzle;
};

export const getPuzzleIds = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('sudoku_puzzles').select('id');
  if (error) throw error;

  return data.map((row) => row.id);
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
