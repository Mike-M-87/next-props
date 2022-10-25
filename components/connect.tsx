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
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function Connect() {
  const buttonTheme: ThemeOptions = {
    accentColor: "#ffa900",
    accentColorForeground: "black",
    fontStack: "system",
    overlayBlur: "small",
    borderRadius: "none",
  };

  return (
    <RainbowKitProvider
      chains={chains}
      theme={{
        lightMode: lightTheme({ ...buttonTheme }),
        darkMode: midnightTheme({ ...buttonTheme }),
      }}
      coolMode={true}
      modalSize="compact"
    >
      <ConnectButton
        label="Connect"
        accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
        showBalance={true}
        chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
      />
    </RainbowKitProvider>

  );
}
