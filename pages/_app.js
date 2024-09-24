import "../app/globals.css";
import Layout from "../layout/default";
import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import Store from "../store/store";

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted === false) {
    return null;
  }

  return (
    <Provider store={Store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
