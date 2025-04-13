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

  useEffect(() => {
    const initUser = async () => {
      console.log("Fetching logged in user...");

      try {
        const res = await getCurrentUser();
        if (res) {
          if (expoPushToken && expoPushToken !== res.token) {
            console.log("Updating push token...");
            await updateUserPushToken(expoPushToken);
            const updatedUser = await getCurrentUser(); 
            setUser(updatedUser);
          } else {
            setUser(res);
          }
          setIsLogged(true);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, [expoPushToken]); // Only re-run when expoPushToken changes

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
