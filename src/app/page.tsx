import { getRandomPuzzleId } from './utils/supabase/puzzlesDb';
import { redirect } from 'next/navigation';

export default async function Home() {
  const id = await getRandomPuzzleId();

  return redirect(`/${id}`);
}
