import Link from "next/link";
import { useEffect } from "react";
import { Provider } from "react-redux";
import Layout from "../components/layout";
import { GET_COMMUNITIES } from "../graphql/queries";
import store from "../redux/store";

export async function getServerSideProps() {
  const response = await GET_COMMUNITIES();
  return {
    props: {
      communities: response.body,
    },
  };
}

export default function Home({ communities }) {
  return (
    <Provider store={store}>
      <Layout data={communities} />
    </Provider>
  );
}
