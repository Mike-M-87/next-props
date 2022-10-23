import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  cssObjectFromTheme,
  cssStringFromTheme,
  darkTheme,
  getDefaultWallets,
  lightTheme,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { themeActions } from "../redux/reducers";

const { chains, provider } = configureChains(
  [chain.mainnet],
  [
    alchemyProvider({ alchemyId: "sm5ZVtyqQSMIKDfb2Cbs5DEncZXouZSF" }),
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
  const buttonTheme = {
    accentColor: "#ffa900",
    accentColorForeground: "black",
    fontStack: "system",
    overlayBlur: "small",
    borderRadius: "none",
  };

  //   useEffect(() => {
  //     if (window && window.matchMedia) {
  //       window
  //         .matchMedia("(prefers-color-scheme: dark)")
  //         .addEventListener("change", (event) => {
  //           dispatch(themeActions.update(event.matches));
  //         });
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  return (
    <WagmiConfig client={wagmiClient}>
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
          accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
          showBalance={true}
          chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
        />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
