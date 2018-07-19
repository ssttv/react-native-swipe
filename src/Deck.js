import React, { Component } from "react";
import { View, Animated, PanResponder, Text, StyleSheet } from "react-native";

class Deck extends Component {
  constructor(props) {
    super(props);

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        console.log(gesture);
      },
      onPanResponderRelease: () => {}
    });

    this.state = { panResponder };
  }

  renderCards() {
    const { data, renderCard } = this.props;
    return data.map(item => renderCard(item));
  }

  render() {
    return (
      <View {...this.state.panResponder.panHandlers}>{this.renderCards()}</View>
    );
  }
}

export default Deck;
