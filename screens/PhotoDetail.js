import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

export default function PhotoDetail({ route }) {
  const { photoObj } = route.params;
  const [progress, setProgress] = useState();
  const [status, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  const callback = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;

    setProgress(progress);
  };

  const downloadResumable = FileSystem.createDownloadResumable(
    photoObj.urls.full,
    FileSystem.documentDirectory + photoObj.id,
    {},
    callback
  );

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: photoObj.urls.full }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.text}>User Name: {photoObj.user.username}</Text>
        <Text style={styles.text}>Likes: {photoObj.likes}</Text>
        <Text style={styles.text}>Description: {photoObj.description}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.overlay,
          { top: "auto", left: "auto", bottom: 30, right: 20 },
        ]}
        onPress={async () => {
          try {
            const { uri } = await downloadResumable.downloadAsync();
            const asset = await MediaLibrary.createAssetAsync(uri);

            console.log("Finished downloading to ", uri);

            if (status === "granted") {
              MediaLibrary.createAlbumAsync("Dogs", asset, false)
                .then(() => console.log("File Saved Successfully"))
                .catch(() => console.log("Error in saving file"));
            }
          } catch (e) {
            console.error(e);
          }
        }}
      >
        <Text style={styles.text}>
          {progress ? `${(progress * 100).toFixed(2)}%` : "Download"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    position: "relative",
  },
  image: {
    resizeMode: "contain",
    flex: 1,
  },
  overlay: {
    position: "absolute",
    left: 10,
    top: 20,
    zIndex: 10,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  text: {
    color: "#fff",
    fontSize: 14,
  },
});
