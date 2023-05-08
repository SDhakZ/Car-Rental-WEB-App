// AuthProvider.js
import React, { createContext, useState, useContext } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [error, setError] = useState("");

  const isAuthenticated = Boolean(user);

  const login = (userData, token) => {
    if (userData.role === "User") {
      setError("Invalid credentials. Please try again.");
    } else {
      setUser({ ...userData, token });
      localStorage.setItem("user", JSON.stringify({ ...userData, token }));
    }
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
        setError(error.response.data.message);
      } else {
        setError(error.message);
        console.log(error);
      }
    } finally {
      console.log("Logout complete");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    handleLogout();
    error ? console.log(error) : console.log("Logout successful");
  };

  const isAdminOrStaff = () => {
    return user && (user.role === "Admin" || user.role === "Staff");
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
