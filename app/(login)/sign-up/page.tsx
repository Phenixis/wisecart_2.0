import { Login } from '../login';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';

export default async function SignUpPage() {
  const user = await getUser();

  if (user) {
    redirect('/dashboard');
  } else {
    return <Login mode="signup" />;
  }
}
