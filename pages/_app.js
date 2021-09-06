import { Auth } from "@supabase/ui";
import { supabase } from "../lib/supabaseInit";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </Auth.UserContextProvider>
  );
}

export default MyApp;
