import { Alert, Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../../lib/supabase";

const Home = () => {
  const onLogout = async () => {
    const { error } = supabase.auth.signOut();

    if (error) {
      Alert.alert("Sign Out", "Error signing out");
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <Text>Home</Text>
      <Button title="Logout" onPress={onLogout} />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
