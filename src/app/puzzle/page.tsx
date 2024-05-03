import { redirect } from 'next/navigation';
import { getRandomPuzzleId } from '../utils/supabase/puzzlesDb';

export default async function Home() {
  const id = await getRandomPuzzleId();

  return redirect(`/puzzle/${id}`);
}
