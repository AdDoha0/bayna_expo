import React from 'react';
import { FlatList, StyleSheet, Platform, Animated } from 'react-native';
import { DialogCard } from './DialogCard';

export function DialogsList({ 
  data, 
  onDialogPress, 
  scrollY, 
  contentPaddingTop,
  renderHeaderContent,
  style 
}) {
  function renderDialogItem({ item }) {
    return (
      <DialogCard 
        dialog={item} 
        onPress={onDialogPress}
      />
    );
  }

  function ListHeader() {
    return (
      <Animated.View style={[styles.listHeader, { paddingTop: contentPaddingTop }]}>
        {renderHeaderContent ? (
          <Animated.View style={styles.headerContentContainer}>
            {renderHeaderContent()}
          </Animated.View>
        ) : null}
      </Animated.View>
    );
  }

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderDialogItem}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={[
        styles.listContainer, 
        Platform.OS === 'web' && styles.webListContainer,
      ]}
      showsVerticalScrollIndicator={Platform.OS !== 'web'}
      bounces={Platform.OS !== 'web'}
      scrollEventThrottle={16}
      style={[styles.flatList, Platform.OS === 'web' && styles.webFlatList, style]}
      nestedScrollEnabled={true}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false },
      )}
      {...(Platform.OS === 'web' && {
        overScrollMode: 'auto',
        scrollEnabled: true,
        alwaysBounceVertical: false,
      })}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  listHeader: {
    paddingBottom: 8,
  },
  headerContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  webFlatList: {
    height: '100%',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  listContainer: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  webListContainer: {
    minHeight: '100%',
    paddingBottom: 80,
  },
});
