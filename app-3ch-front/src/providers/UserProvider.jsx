import { useCallback, useEffect, useState } from "react";
import UserContext from "contexts/UserContext";

const initialUserState = {
  uid: null,
  userType: "anonymous",
};

const UserProvider = ({ children }) => {
  const userState = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : Object.assign({}, initialUserState);
  const [user, setUser] = useState(userState);

  const resetUser = useCallback(() => {
    setUser(Object.assign({}, initialUserState));
  }, []);

  const value = {
    user,
    setUser,
    resetUser,
  };

  useEffect(() => {
    if (user.uid) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
