import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { theme } from "../constants/theme";

const PostCard = ({ item, currentUser, router, hasShadow = true }) => {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <Text>PostCard</Text>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
});
