import { createContext, useEffect, useState, useContext } from "react";
import React from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //sign up
  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    console.log(data)
    if (error) {
      console.error("Error signing up:", error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  //sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error("Error signing in:", error);
        return { success: false, error };
      }
      console.log("Sign in successful:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Error signing in:", error);
      return { success: false, error };
    }
  };

  //sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return { success: false, error };
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
