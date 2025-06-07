import { useState, createContext, useMemo } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const value = useMemo(
    () => ({ userInfo, setUserInfo }),
    [userInfo, setUserInfo]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
