import Layout from "../components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider, useSession, signIn } from "next-auth/react";
import React from "react";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  //TODO: nest layout inside Auth component ...
  return (
    <SessionProvider session={session}>
      <ChakraProvider resetCSS>
        <Layout>
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </ChakraProvider>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  React.useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, status]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>;
}
