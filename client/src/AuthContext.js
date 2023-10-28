import {createContext, useState} from "react";

export const AuthContext = createContext({});

export function AuthContextProvider({children}) {
  const [userInfo,setUserInfo] = useState({});
  return (
    <AuthContext.Provider value={{userInfo,setUserInfo}}>
      {children}
    </AuthContext.Provider>
  );
}