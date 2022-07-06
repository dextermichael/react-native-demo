import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StackActions } from "@react-navigation/native";

const COLORS = [
  {
    label: "None",
    value: "none",
  },
  {
    label: "Black and White",
    value: "black_and_white",
  },
  {
    label: "Black",
    value: "black",
  },
  {
    label: "White",
    value: "white",
  },
  {
    label: "Yellow",
    value: "yellow",
  },
  {
    label: "Orange",
    value: "orange",
  },
  {
    label: "Red",
    value: "red",
  },
  {
    label: "Purple",
    value: "purple",
  },
  {
    label: "Magenta",
    value: "magenta",
  },
  {
    label: "Green",
    value: "green",
  },
  {
    label: "Teal",
    value: "teal",
  },
  {
    label: "Blue",
    value: "blue",
  },
];

const ORIENTATIONS = [
  { label: "None", value: "none" },
  { label: "Landscape", value: "landscape" },
  { label: "Portrait", value: "portrait" },
  { label: "Squarish", value: "squarish" },
];

export default function PhotoList({ navigation }) {
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedOrientation, setSelectedOrientation] = useState(
    ORIENTATIONS[0].value
  );

  const getMoviesFromApiAsync = async (page, color, orientation) => {
    try {
      const url = `https://api.unsplash.com/search/photos?page=${page}&query=dog${
        color !== "none" ? "&color=" + color : ""
      }${orientation !== "none" ? "&orientation=" + orientation : ""}`;

      const response = await fetch(url, {
        method: "get",
        headers: new Headers({
          Authorization:
            "Client-ID bPfgiIw4vW72MUt72sWrzfIR4KSMdhe3J0brvyZqoCs",
        }),
      });
      const json = await response.json();

      setIsFetching(false);

      if (page < json.total_pages) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }

      setPhotos([...photos, ...json.results]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getMoviesFromApiAsync(1, "none", "none");
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getMoviesFromApiAsync(1, selectedColor, selectedOrientation);
  }, [selectedColor, selectedOrientation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.item}
      onPress={() => {
        const pushAction = StackActions.push("PhotoDetail", { photoObj: item });
        navigation.dispatch(pushAction);
      }}
    >
      <Image source={{ uri: item.urls.thumb }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filters}>
        <View style={styles.filter}>
          <Text style={styles.label}>Choose color</Text>
          <Picker
            selectedValue={selectedColor}
            onValueChange={(value) => {
              setPhotos([]);
              setSelectedColor(value);
            }}
          >
            {COLORS.map((item) => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.filter}>
          <Text style={styles.label}>Choose orientation</Text>
          <Picker
            selectedValue={selectedOrientation}
            onValueChange={(value) => {
              setPhotos([]);
              setSelectedOrientation(value);
            }}
          >
            {ORIENTATIONS.map((item) => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
      </View>
      {photos.length > 0 ? (
        <FlatList
          data={photos}
          renderItem={renderItem}
          keyExtracto={(item) => item.id}
          onEndReached={() => {
            if (!isFetching) {
              setPage(page + 1);
              getMoviesFromApiAsync(
                page + 1,
                selectedColor,
                selectedOrientation
              );
            }
          }}
          // onEndReachedThreshold={2}
          // scrollEventThrottle={150}
          ListFooterComponent={hasMore && <ActivityIndicator size="large" />}
        />
      ) : (
        <ActivityIndicator size="large" />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filters: {
    marginVertical: 20,
    flexDirection: "row",
  },
  label: {
    textAlign: "center",
    fontSize: 18,
  },
  filter: {
    flex: 1,
  },
  item: {
    marginVertical: 3,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
