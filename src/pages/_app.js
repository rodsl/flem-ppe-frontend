
import { ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";
import { SessionProvider, useSession } from "next-auth/react";
import { StateMachineProvider, createStore } from "little-state-machine";
import { Global, css } from "@emotion/react";
import Head from "next/head";
import theme from "styles/theme";


const myTheme = extendTheme(theme);

const GlobalStyle = ({ children }) => (
  <>
    <Head>
      <meta content="width=device-width,initial-scale=1" name="viewport" />
    </Head>
    <CSSReset />
    <Global
      styles={css`
        html {
          scroll-behavior: smooth;
        }
        #__next {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
      `}
    />
    {children}
  </>
);

createStore({});

function MyApp({ Component,
  pageProps: { session, ...pageProps }, router }) {
  return (
    <ChakraProvider theme={myTheme} >
      {/* <AnimatePresence>
        <motion.div
          key={router.route}
          initial="pageInitial"
          animate="pageAnimate"
          exit="pageExit"
          variants={variants}
        > */}
          <GlobalStyle />
          <StateMachineProvider>
            <SessionProvider session={session}>
              {Component.auth ? (
                <Auth>
                  <Component {...pageProps} />
                </Auth>
              ) : (
                <Component {...pageProps} />
              )}
            </SessionProvider>
          </StateMachineProvider>
        {/* </motion.div>
      </AnimatePresence> */}
    </ChakraProvider>
  );
}

function Auth({ children }) {
  const { data: session, status } = useSession({ required: true });
  const isUser = !!session?.user;

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>;
}

export default MyApp;
