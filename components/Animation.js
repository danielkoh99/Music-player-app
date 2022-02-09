import * as React from 'react';
import { useRef } from 'react';
import { Animated } from 'react-native';

const Fade = props => {
  const fadeAnim = useRef(new Animated.Value(15)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      useNativeDriver: false,
      toValue: 0,
      duration: 2000,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}>
      {props.children}
    </Animated.View>
  );
};

export default Fade;
