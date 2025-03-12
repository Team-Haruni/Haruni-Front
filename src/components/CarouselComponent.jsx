import React, { useState } from "react";
import { View, FlatList, StyleSheet, ImageBackground } from "react-native";
import Colors from "../../styles/color";
import { setCurrentPlaneIndex } from "../../redux/slices/planeSlice";
import { useSelector, useDispatch } from "react-redux";

const CarouselComponent = ({ planeImages, lockStartPlane }) => {
  const dispatch = useDispatch();
  const currentIndex = useSelector((state) => state.plane.currentIndex);
  const [screenWidth, setScreenWidth] = useState(0);

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setScreenWidth(width);
  };

  const onScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offsetX / screenWidth);
    dispatch(setCurrentPlaneIndex(index));
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      {screenWidth > 0 && (
        <FlatList
          data={planeImages}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item) => item.key}
          onScroll={onScroll}
          snapToInterval={screenWidth + 15}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={{ gap: 15 }}
          initialScrollIndex={currentIndex} // 초기 위치 설정
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: (screenWidth + 15) * index,
            index,
          })}
          renderItem={({ item }) => (
            <View
              style={[
                styles.page,
                {
                  width: screenWidth,
                  borderRadius: 20,
                },
              ]}
            >
              <ImageBackground
                source={item.url}
                style={[{ width: screenWidth, height: "100%" }]}
                resizeMode="cover"
              />
            </View>
          )}
        />
      )}
      <View style={styles.dotContainer}>
        {planeImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? Colors.pointColor : "#dfdfdf",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    height: "100%",
    overflow: "hidden",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5, // `borderRadius: "50%"` 대신 숫자로 설정
    marginHorizontal: 4,
  },
});

export default CarouselComponent;
