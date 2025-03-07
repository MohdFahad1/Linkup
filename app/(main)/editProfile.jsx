import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { hp, wp } from "../../helpers/common";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { Image } from "expo-image";
import { userAuth } from "../../contexts/AuthContext";
import { getUserImageSrc, uploadFile } from "../../services/imageService";
import Icon from "../../assets/icons";
import { theme } from "../../constants/theme";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { updateUser } from "../../services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const editProfile = () => {
  const { user: currentUser, setUserData } = userAuth();
  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    image: null,
    bio: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name,
        phoneNumber: currentUser.phoneNumber,
        image: currentUser.image,
        bio: currentUser.bio,
        address: currentUser.address,
      });
    }
  }, [currentUser]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, bio, image, address } = userData;

    if (!name || !address || !phoneNumber || !bio || !image) {
      Alert.alert("Profile", "Please fill all the fields");
      return;
    }

    setLoading(true);

    if (typeof image === "object") {
      let imageRes = await uploadFile("profiles", image?.uri, true);

      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }

    try {
      const res = await updateUser(currentUser?.id, userData);

      if (res.success) {
        setUserData({ ...currentUser, ...userData });
        router.back();
      } else {
        Alert.alert("Error", res.msg || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error updating user: ", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }

    console.log("Update User result: ", res);
  };

  let imageSource =
    user.image && typeof user.image === "object"
      ? user.image.uri
      : getUserImageSrc(user.image);

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" />

          {/* form */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details
            </Text>
            <Input
              icon={<Icon name="user" />}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={(value) => setUser({ ...user, name: value })}
            />
            <Input
              icon={<Icon name="call" />}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
            />
            <Input
              icon={<Icon name="location" />}
              placeholder="Enter your address"
              value={user.address}
              onChangeText={(value) => setUser({ ...user, address: value })}
            />
            <Input
              placeholder="Enter your bio"
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={(value) => setUser({ ...user, bio: value })}
            />

            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default editProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    height: hp(12),
    width: wp(12),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  avatar: {
    width: "200%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.4,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -35,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowOffset: theme.colors.textLight,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },

  input: {
    flexDirection: "row",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },

  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});
