import { Login } from '../login';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';

export default async function SignInPage() {
  const user = await getUser();

  if (user) {
    redirect('/dashboard/general');
  } else {
    return <Login mode="signin" />;
  }
}
