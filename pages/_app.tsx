import { Provider } from "react-redux";
import "../styles/globals.css";
import store from "../redux/store";
import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  getDefaultWallets,
  lightTheme,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ThemeOptions } from "@rainbow-me/rainbowkit/dist/themes/baseTheme";


const { chains, provider } = configureChains(
  [chain.mainnet],
  [
    alchemyProvider({ apiKey: "sm5ZVtyqQSMIKDfb2Cbs5DEncZXouZSF" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "PropHouse POAPs",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});


function MyApp({ Component, pageProps }) {
  return (

    <WagmiConfig client={wagmiClient}>

      <Provider store={store}>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        ></link>
        <Component {...pageProps} />
      </Provider>

    </WagmiConfig>
  );
}

export default MyApp;
