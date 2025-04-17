import React, { createContext, useContext, useEffect, useState } from "react";
import usePushNotification from "@/hooks/usePushNotification";
import { getCurrentUser, updateUserPushToken } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const expoPushToken = usePushNotification();
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refetchUser = async () => {
    setLoading(true);
    try {
      const res = await getCurrentUser();
      if (res) {
        if (expoPushToken && expoPushToken !== res.token) {
          await updateUserPushToken(expoPushToken);
        }
        const updatedUser = await getCurrentUser();
        setUser(updatedUser);
        setIsLogged(true);
      } else {
        setUser(null);
        setIsLogged(false);
      }
    } catch (error) {
      console.error("Error fetching user", error);
      setUser(null);
      setIsLogged(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchUser();
  }, [expoPushToken]);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        refetchUser, // expose function
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
