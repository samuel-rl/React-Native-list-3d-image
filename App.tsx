/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {FULL_ITEM_SIZE, items} from './asset';

const App = () => {
  const translateX = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler(event => {
    const xOffset = event.contentOffset.x;
    translateX.value = xOffset;
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        contentContainerStyle={styles.contentContainer}
        onScroll={scrollHandler}
        showsHorizontalScrollIndicator={false}
        snapToInterval={FULL_ITEM_SIZE}
        scrollEventThrottle={16}>
        {items.map((item, index) => {
          const uas = useAnimatedStyle(() => {
            const itemDistance =
              Math.floor(translateX.value - index * FULL_ITEM_SIZE) /
              FULL_ITEM_SIZE;
            const scale = interpolate(
              itemDistance,
              [-1, 0, 1],
              [1.02, 1.05, 1.06],
              Extrapolate.EXTEND,
            );
            const trX = interpolate(itemDistance, [-1, 0, 1], [-16, 0, 10]);
            const trY = interpolate(
              itemDistance,
              [-1, 0, 1],
              [-4, 0, 2],
              Extrapolate.CLAMP,
            );
            let style = {
              transform: [{scale}, {translateX: trX}, {translateY: trY}],
            };
            return style;
          });
          return (
            <Animated.View key={item.id.toString()} style={styles.item}>
              <LinearGradient colors={item.colors} style={styles.gradient} />
              <Animated.View style={[styles.containerImage, uas]}>
                <Image style={[styles.image]} source={item.image} />
              </Animated.View>
              <View style={styles.containerInfos}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    width: 250,
    height: 250,
    marginHorizontal: 10,
    flexDirection: 'column',
  },
  containerImage: {
    height: '80%',
  },
  image: {
    height: 230,
    aspectRatio: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
    bottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 15,
  },
  containerInfos: {
    height: '20%',
    width: '100%',
    padding: 10,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  fullGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  contentContainer: {
    alignSelf: 'center',
    paddingHorizontal: FULL_ITEM_SIZE / 4,
  },
});

export default App;
