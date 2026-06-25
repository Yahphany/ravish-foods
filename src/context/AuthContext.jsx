import { createContext, useEffect, useState, useContext } from "react";
import React from "react";
import { supabase } from "./supabaseClient";

// Create the context for sharing auth states (session, user details, auth methods)
const AuthContext = createContext();

// Provider component that wraps the app and provides auth data/methods to child components
export const AuthContextProvider = ({ children }) => {
  // session state:
  // - undefined: initial loading state (checking auth status)
  // - null: user is not authenticated
  // - object: user is authenticated with active session details
  const [session, setSession] = useState(undefined);

  // userRole state:
  // - undefined: checking profile role
  // - null: no role (not authenticated)
  // - 'buyer', 'vendor', 'logistics': active authenticated role
  const [userRole, setUserRole] = useState(undefined);

  // Helper to fetch role from Profiles table
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error || !data) {
        console.warn(
          "Could not retrieve user role, defaulting to buyer:",
          error,
        );
        return "buyer";
      }
      return data.role;
    } catch (err) {
      console.error("Exception fetching user role:", err);
      return "buyer";
    }
  };

  // useEffect runs once when the provider mounts to initialize the auth session and user role
  useEffect(() => {
    // 1. Fetch the current active session (e.g. from localStorage/cookies) immediately
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        let role = await fetchUserRole(session.user.id);
        if (session.user.email === "ebenezeryahphany17@gmail.com") {
          role = "vendor";
        }
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    });

    // 2. Set up a listener for real-time auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        let role = await fetchUserRole(session.user.id);
        if (session.user.email === "ebenezeryahphany17@gmail.com") {
          role = "vendor";
        }
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    });

    // Cleanup: unsubscribe from the auth listener when the provider unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // signUpNewUser: Creates a new user account with Supabase using email and password,
  // passing display_name and role metadata to the user profiles trigger.
  const signUpNewUser = async (
    email,
    password,
    role = "buyer",
    displayName = "",
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          role: role,
          display_name: displayName,
        },
      },
    });
    console.log(data);
    if (error) {
      console.error("Error signing up:", error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  // signInUser: Authenticates an existing user and enforces role validation.
  // Checks if the user's role in the 'profiles' table matches the requested expectedRole.
  // If there is a mismatch, the user is logged out immediately to destroy the session.
  const signInUser = async (email, password, expectedRole) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error("Error signing in:", error);
        return { success: false, error };
      }

      // Fetch the role for the authenticated user to verify permissions
      const role = await fetchUserRole(data.user.id);
      if (role !== expectedRole) {
        // Mismatch found: sign out immediately and flag error
        await supabase.auth.signOut();
        return {
          success: false,
          error: {
            message: `This account is registered as a ${role}, not a ${expectedRole}.`,
          },
        };
      }

      console.log("Sign in successful:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Error signing in:", error);
      return { success: false, error };
    }
  };

  // signOut: Destroys the active Supabase session and logs the user out.
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return { success: false, error };
    }
    setUserRole(null);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ session, userRole, signUpNewUser, signInUser, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to allow easy access to the AuthContext from child components
export const UserAuth = () => {
  return useContext(AuthContext);
};
