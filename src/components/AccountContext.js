import React, { createContext } from "react";

const AccountContext = createContext({
  signedIn: false,
});

export default AccountContext;
