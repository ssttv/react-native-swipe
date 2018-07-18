import React, { Component } from "react";
import { View, Animated, Text, StyleSheet } from "react-native";

class Deck extends Component {
  renderCards() {
    const { data, renderCard } = this.props;
    return data.map(item => renderCard(item));
  }

  render() {
    return <View>{this.renderCards()}</View>;
  }
}

export default Deck;
