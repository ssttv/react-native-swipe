import React from "react";
import { StyleSheet, Text, Platform, View } from "react-native";
import Ball from "./src/Ball";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        paddingTop: 30
      },
      android: {
        paddingTop: 20
      }
    })
  }
});

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Ball />
      </View>
    );
  }
}
