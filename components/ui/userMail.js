import { auth } from "/auth"
 
export default async function UserMail() {
  const session = await auth()
 
  if (!session.user) return null
 
  return (
    <div>
        <p>
            Your email is {session.user.email}.
        </p>
    </div>
  )
}