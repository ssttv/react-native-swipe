import React, { Component } from "react";
import {
  View,
  Animated,
  PanResponder,
  LayoutAnimation,
  UIManager,
  StyleSheet,
  Dimensions
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 750;

const styles = StyleSheet.create({
  cardOfStack: {
    position: "absolute",
    width: SCREEN_WIDTH
  }
});

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {}
  };

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
          this.forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          console.log("swiped left");
          this.forceSwipe("left");
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { panResponder, position, index: 0 };
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  onSwipeComplete(direction) {
    const { onSwipeRight, onSwipeLeft, data } = this.props;
    const { position, index } = this.state;
    const item = data[index];
    if (direction === "right") {
      onSwipeRight(item);
    } else if (direction === "left") {
      onSwipeLeft(item);
    }
    position.setValue({ x: 0, y: 0 });
    this.setState({ index: index + 1 });
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

  resetPosition() {
    const { position } = this.state;
    Animated.spring(position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  forceSwipe(direction) {
    const { position } = this.state;
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  renderCards() {
    const {
      index,
      panResponder: { panHandlers }
    } = this.state;
    const { data, renderCard, renderNoMoreCards } = this.props;

    if (index === data.length) {
      return renderNoMoreCards();
    }

    return data
      .map((item, itemId) => {
        if (itemId < index) {
          return null;
        }
        if (itemId === index) {
          return (
            <Animated.View
              key={item.id}
              style={[this.getCardStyle(), styles.cardOfStack]}
              {...panHandlers}
            >
              {renderCard(item)}
            </Animated.View>
          );
        }
        return (
          <View
            key={item.id}
            style={[styles.cardOfStack, { top: 15 * (itemId - index) }]}
          >
            {renderCard(item)}
          </View>
        );
      })
      .reverse();
  }

  render() {
    return <Animated.View>{this.renderCards()}</Animated.View>;
  }
}

export default Deck;
