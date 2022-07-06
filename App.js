import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PhotoList from "./screens/PhotoList";
import PhotoDetail from "./screens/PhotoDetail";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="PhotoList">
        <Stack.Screen
          name="PhotoList"
          component={PhotoList}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="PhotoDetail"
          component={PhotoDetail}
          options={{ title: "Detail" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
