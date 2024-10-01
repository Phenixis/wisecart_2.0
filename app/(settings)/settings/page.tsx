import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  } else {
    redirect('/settings/general');
  }
}
