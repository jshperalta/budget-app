import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {
    console.log('showRightProgress:', prog.value);
    console.log('appliedTranslation:', drag.value);

    return {
      transform: [{ translateX: drag.value + 50 }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
        <TouchableOpacity
          style={styles.rightAction}
          onPress={() => console.log('Edit action pressed')}>
            <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.rightAction}>
            <Text>Delete</Text>
        </TouchableOpacity>
    </Reanimated.View>
  );
}

function leftAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
) {
  const styleAnimation = useAnimatedStyle(() => {
    console.log('showLeftProgress:', prog.value);
    console.log('appliedTranslation:', drag.value);

    return {
      transform: [{ translateX: drag.value - 50 }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <Text style={styles.rightAction}>Archive</Text>
    </Reanimated.View>
  );
}

export default function Example() {
  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        containerStyle={styles.swipeable}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={RightAction}
        renderLeftActions={leftAction}>
        <Text>Swipe me!</Text>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rightAction: { 
    color: 'white', 
    width: 50, 
    height: 50, 
    backgroundColor: 'blue' 
},
  separator: {
    width: '100%',
    borderTopWidth: 1,
  },
  swipeable: {
    height: 50,
    backgroundColor: 'papayawhip',
    alignItems: 'center',
  },
});