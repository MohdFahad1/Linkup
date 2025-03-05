import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider, userAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth } = userAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Session user: ", session?.user);

      if (session) {
      } else {
      }
    });
  });

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default _layout;
