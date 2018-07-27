import React, { Component } from "react";
import {
  View,
  Animated,
  PanResponder,
  Text,
  StyleSheet,
  Dimensions
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          console.log("swiped right");
          this.forceSwipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          console.log("swiped left");
          this.forceSwipeLeft();
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { panResponder, position };
  }

  forceSwipeRight() {
    const { position } = this.state;
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start();
  }

  forceSwipeLeft() {
    const { position } = this.state;
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start();
  }

  resetPosition() {
    const { position } = this.state;
    Animated.spring(position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-500, 0, 500],
      outputRange: ["-120deg", "0deg", "120deg"]
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }

  renderCards() {
    const {
      panResponder: { panHandlers }
    } = this.state;
    const { data, renderCard } = this.props;
    return data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={this.getCardStyle()}
            {...panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        );
      }
      return renderCard(item);
    });
  }

  render() {
    return <View>{this.renderCards()}</View>;
  }
}

export default Deck;
