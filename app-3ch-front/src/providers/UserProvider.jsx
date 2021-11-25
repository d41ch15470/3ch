import { useState, useEffect } from "react";
import UserContext from "contexts/UserContext";

const initialUserState = {
  accessToken: null,
  client: null,
  expiry: null,
  uid: null,
  tokenType: null,
  userType: "anonymous",
};

const UserProvider = ({ children }) => {
  const userState = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : initialUserState;
  const [user, setUser] = useState(userState);

  const resetUser = () => {
    setUser(Object.assign({}, initialUserState));
  };

  const value = {
    user,
    setUser,
    resetUser,
  };

  useEffect(() => {
    if (user.uid) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
