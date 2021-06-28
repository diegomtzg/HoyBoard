import { createContext } from "react";

const AccountContext = createContext({
  signedIn: false,
  loadingGoogleSignIn: true,
});

export default AccountContext;
