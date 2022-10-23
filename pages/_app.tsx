import { Provider } from "react-redux";
import "../styles/globals.css";
import store from "../redux/store";


function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
