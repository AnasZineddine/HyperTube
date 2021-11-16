import Movies from "../components/Movies";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, loading } = useSession();
  if (typeof window !== "undefined" && loading) return null;
  if (!session) return <p>sign in first</p>;
  else return <Movies />;
}
