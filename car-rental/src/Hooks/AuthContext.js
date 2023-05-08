import React, { createContext, useState, useContext} from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const isAuthenticated = Boolean(user);

  const login = (userData, token) => {
    setUser({ ...userData, token });
    localStorage.setItem("user", JSON.stringify({ ...userData, token }));
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7124/api/UserAuth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("Logout successful");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
      } else {
        console.log(error.message);
      }
    } finally {
      console.log("Logout complete");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    handleLogout();
  };

  const isAdminOrStaff = () => {
    return user && (user.role === "Admin" || user.role === "User");
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, isAdminOrStaff }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};
