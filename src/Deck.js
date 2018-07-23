import React, { Component } from "react";
import { View, Animated, PanResponder, Text, StyleSheet } from "react-native";

class Deck extends Component {
  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: () => {}
    });

    this.state = { panResponder, position };
  }

  renderCards() {
    const { data, renderCard } = this.props;
    return data.map(item => renderCard(item));
  }

  render() {
    const {
      panResponder: { panHandlers },
      position
    } = this.state;

    return (
      <Animated.View style={position.getLayout()} {...panHandlers}>
        {this.renderCards()}
      </Animated.View>
    );
  }
}

export default Deck;
