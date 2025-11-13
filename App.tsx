import React, { useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  useEffect(() => {
    const redirect = AuthSession.makeRedirectUri({
      preferLocalhost: true,
    });
    console.log("👉 Redirect URI:", redirect);
  }, []);

  return <RootNavigator />;
}
