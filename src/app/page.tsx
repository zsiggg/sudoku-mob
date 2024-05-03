import { getRandomPuzzleId } from './getPuzzles';
import { redirect } from 'next/navigation';

export default async function Home() {
  const id = await getRandomPuzzleId();

  return redirect(`/${id}`);
}
