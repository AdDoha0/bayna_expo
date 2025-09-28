import React, { useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import {
  Card,
  Text,
  Chip,
  useTheme,
  Surface,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import { dialogsData } from '../data/dialogsData';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 280; // Высота заголовка

export default function DialogsListScreen({ navigation }) {
  const theme = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Анимация для заголовка
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5, HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  // Анимация для контента - убираем отступ сверху при скролле
  const contentPaddingTop = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'مبتدئ': return '#10B981';
      case 'متوسط': return '#F59E0B';
      case 'متقدم': return '#EF4444';
      default: return theme.colors.primary;
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'مبتدئ': return 'Начальный';
      case 'متوسط': return 'Средний';
      case 'متقدم': return 'Продвинутый';
      default: return difficulty;
    }
  };

  const renderDialogItem = ({ item, index }) => (
    <Card
      style={styles.dialogCard}
      mode="elevated"
      elevation={6}
      onPress={() => {
        navigation.navigate('DialogDetail', { 
          dialogId: item.id,
          title: item.subtitle 
        });
      }}
    >
      <LinearGradient
        colors={['#FFFFFF', '#FAFBFF']}
        style={styles.cardGradient}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text variant="headlineSmall" style={styles.arabicTitle}>
                {item.title}
              </Text>
              <Text variant="titleLarge" style={styles.russianTitle}>
                {item.subtitle}
              </Text>
            </View>
            <Chip
              mode="flat"
              textStyle={styles.chipText}
              style={[
                styles.difficultyChip, 
                { backgroundColor: getDifficultyColor(item.difficulty) + '20' }
              ]}
              textColor={getDifficultyColor(item.difficulty)}
            >
              {getDifficultyText(item.difficulty)}
            </Chip>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.dialogInfo}>
              <Surface style={styles.infoChip} elevation={1}>
                <Text variant="labelLarge" style={styles.infoText}>
                  📚 {item.dialogues.length} реплик
                </Text>
              </Surface>
            </View>
            <Surface style={styles.arrowButton} elevation={2}>
              <IconButton
                icon="arrow-left"
                size={24}
                iconColor={theme.colors.primary}
                style={styles.arrowIcon}
              />
            </Surface>
          </View>
        </Card.Content>
      </LinearGradient>
    </Card>
  );

  return (
          <View style={styles.container}>
        <Animated.View
          style={[
            styles.headerContainer,
            {
              transform: [{ translateY: headerTranslateY }],
              opacity: headerOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={['#4338CA', '#6366F1', '#8B5CF6']}
            style={styles.headerGradient}
          >
            <Surface style={styles.headerSurface} elevation={0}>
          <Text variant="displayMedium" style={styles.headerArabic}>
            بين يديك
          </Text>
          <Text variant="headlineLarge" style={styles.headerTitle}>
            📖 Диалоги для изучения
          </Text>
          <Text variant="titleMedium" style={styles.headerSubtitle}>
            Изучайте арабский язык через интересные диалоги
          </Text>
          <View style={styles.decorativeElement}>
            <View style={styles.decorativeDot} />
            <View style={styles.decorativeLine} />
            <View style={styles.decorativeDot} />
                      </View>
          </Surface>
          </LinearGradient>
        </Animated.View>

              <Animated.FlatList
          data={dialogsData}
          renderItem={renderDialogItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContainer, 
            Platform.OS === 'web' && styles.webListContainer,
            { paddingTop: contentPaddingTop }
          ]}
          showsVerticalScrollIndicator={Platform.OS !== 'web'}
          bounces={Platform.OS !== 'web'}
          scrollEventThrottle={16}
          style={[styles.flatList, Platform.OS === 'web' && styles.webFlatList]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'web' ? 0 : (StatusBar.currentHeight || 0),
    paddingBottom: Platform.OS === 'web' ? 0 : 70, // Отступ для навигационной панели
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflow: 'hidden',
    }),
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1000,
  },
  headerGradient: {
    flex: 1,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerSurface: {
    backgroundColor: 'transparent',
    padding: 28,
    paddingTop: 20,
  },
  headerArabic: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: 12,
    writingDirection: 'rtl',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    color: '#E0E7FF',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 24,
    marginBottom: 20,
  },
  decorativeElement: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E7FF',
    opacity: 0.8,
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E7FF',
    opacity: 0.6,
  },
  flatList: {
    flex: 1,
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
  dialogCard: {
    marginBottom: 20,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  cardGradient: {
    borderRadius: 24,
  },
  cardContent: {
    padding: 24,
  },
  cardHeader: {
    marginBottom: 20,
  },
  titleContainer: {
    marginBottom: 16,
  },
  arabicTitle: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '800',
    color: '#4338CA',
    marginBottom: 8,
    lineHeight: 32,
  },
  russianTitle: {
    lineHeight: 28,
    fontWeight: '600',
    color: '#1E293B',
  },
  difficultyChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogInfo: {
    flex: 1,
  },
  infoChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  infoText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  arrowButton: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    marginLeft: 12,
  },
  arrowIcon: {
    margin: 0,
  },
}); 