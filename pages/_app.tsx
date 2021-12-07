import { ChakraProvider, GlobalStyle } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useMemo } from "react";
import { Api } from "../api/api";
import { Address } from "../hook/useAccount";
import { theme } from "../theme/theme";
import { Page } from "../views/common/Page";

function MyApp({ Component, pageProps }: AppProps) {
  const endpoints = useMemo(() => {
    const array: string[] = ["wss://karura.api.onfinality.io/public-ws"];
    return array
      .map((a) => [Math.random(), a])
      .sort((a, b) => (a[0] as number) - (b[0] as number))
      .map((a) => a[1]) as string[];
  }, []);
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
      <Api endpoints={endpoints}>
        <Address>
          <ChakraProvider theme={theme}>
            <GlobalStyle />
            <Page>
              <Component {...pageProps} />
            </Page>
          </ChakraProvider>
        </Address>
      </Api>
    </>
  );
}

export default MyApp;
