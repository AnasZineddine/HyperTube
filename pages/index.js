import Movies from "../components/Movies";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);
  if (session) return <Movies />;
  else return <p>sign in first</p>;
}
