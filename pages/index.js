import Movies from "../components/Movies";
import { useSession } from "next-auth/react";

export default function Home() {
  return <Movies />;
}

Home.auth = true;
