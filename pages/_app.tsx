import { ChakraProvider, GlobalStyle } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { theme } from "../theme/theme";
import { Page } from "../views/common/Page";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Karura Pulse</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="description" content="Cross-chain DeFi Hub for Polkadot, Kusama and beyond." />
        <meta
          name="keywords"
          content="polkadot, kusama, acala, acala network, karura, stablecoin, defi, honzon protocol, homa protocol, blockchain, substrate, stats"
        />
        <meta property="og:url" content="https://stats.karura.network/" />
        <meta property="og:image" content="https://stats.karura.network/karura-og-card.png" />
        <meta property="og:title" content="Karura Stats" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://stats.karura.network/" />
        <meta property="twitter:image" content="https://stats.karura.network/karura-og-card.png" />
      </Head>
      <ChakraProvider theme={theme}>
        <GlobalStyle />
        <Page>
          <Component {...pageProps} />
        </Page>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
