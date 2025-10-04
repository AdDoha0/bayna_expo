# Руководство по использованию Settings Context

## 🚀 Быстрый старт

### Использование в любом компоненте

```javascript
import { useSettings } from './features/settings';

function MyComponent() {
  const { settings, toggle, actions, appVersion, isReady } = useSettings();
  
  // Читаем настройки
  if (settings.darkTheme) {
    // темная тема включена
  }
  
  // Переключаем boolean настройку
  toggle('notifications');
  
  // Вызываем действия
  actions.openFeedback();
  actions.rateApp();
  
  return <View>...</View>;
}
```

## 📚 API Reference

### `useSettings()`

Главный хук для работы с настройками. Возвращает объект:

```typescript
{
  // Текущие настройки
  settings: {
    notifications: boolean,      // Push-уведомления
    soundEffects: boolean,        // Звуковые эффекты
    autoTranscription: boolean,   // Автопоказ транскрипции
    dailyReminder: boolean,       // Ежедневные напоминания
    darkTheme: boolean,           // Темная тема
    arabicFont: string,           // Стиль арабского шрифта
  },
  
  // Сеттер для любых настроек
  setSettings: (settings) => void,
  
  // Хелпер для переключения boolean настроек
  toggle: (key: string) => void,
  
  // Версия приложения
  appVersion: string,
  
  // Готовность (загружены ли настройки из storage)
  isReady: boolean,
  
  // Доступные действия
  actions: {
    openFeedback: () => Promise<void>,  // Открыть email для обратной связи
    rateApp: () => Promise<void>,       // Открыть окно оценки приложения
  }
}
```

## 💡 Примеры использования

### 1. Чтение настроек

```javascript
function SoundButton() {
  const { settings } = useSettings();
  
  const playSound = () => {
    if (settings.soundEffects) {
      Audio.play('click.mp3');
    }
  };
  
  return <Button onPress={playSound} />;
}
```

### 2. Изменение настроек (toggle)

```javascript
function ThemeToggle() {
  const { settings, toggle } = useSettings();
  
  return (
    <Switch
      value={settings.darkTheme}
      onValueChange={() => toggle('darkTheme')}
    />
  );
}
```

### 3. Изменение настроек (setState)

```javascript
function FontSelector() {
  const { settings, setSettings } = useSettings();
  
  const changeFontSize = (size) => {
    setSettings(prev => ({
      ...prev,
      arabicFont: size,
    }));
  };
  
  return (
    <Picker
      selectedValue={settings.arabicFont}
      onValueChange={changeFontSize}
    >
      <Picker.Item label="Стандартный" value="standard" />
      <Picker.Item label="Большой" value="large" />
    </Picker>
  );
}
```

### 4. Использование actions

```javascript
function FeedbackButton() {
  const { actions } = useSettings();
  
  return (
    <Button 
      title="Обратная связь" 
      onPress={actions.openFeedback}
    />
  );
}

function RateButton() {
  const { actions } = useSettings();
  
  return (
    <Button 
      title="Оценить приложение" 
      onPress={actions.rateApp}
    />
  );
}
```

### 5. Проверка isReady

```javascript
function MyScreen() {
  const { isReady, settings } = useSettings();
  
  if (!isReady) {
    return <LoadingScreen />;
  }
  
  // Безопасно использовать settings, они загружены из storage
  return <View>{settings.darkTheme ? <Dark /> : <Light />}</View>;
}
```

### 6. Показ версии приложения

```javascript
function AboutScreen() {
  const { appVersion } = useSettings();
  
  return (
    <View>
      <Text>Версия: {appVersion}</Text>
    </View>
  );
}
```

## 🎨 Интеграция с темой

Тема автоматически реагирует на `settings.darkTheme`:

```javascript
// App.js (уже реализовано)
function ThemedApp() {
  const { settings } = useSettings();
  const theme = createAppTheme(settings.darkTheme);
  
  return (
    <PaperProvider theme={theme}>
      {/* Все компоненты Paper используют динамическую тему */}
    </PaperProvider>
  );
}
```

Использование в компонентах:

```javascript
import { useTheme } from 'react-native-paper';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.onSurface }}>
        Текст адаптируется к теме
      </Text>
    </View>
  );
}
```

## 🔧 Расширение

### Добавить новую настройку

1. **Обновить DEFAULTS** в `useSettingsState.js`:

```javascript
const DEFAULTS = {
  ...existing,
  myNewSetting: 'default_value',  // 👈 Добавить
};
```

2. **Использовать в любом месте**:

```javascript
const { settings, setSettings } = useSettings();

// Читать
console.log(settings.myNewSetting);

// Изменить
setSettings(prev => ({ ...prev, myNewSetting: 'new_value' }));
```

### Добавить новое действие

1. **Создать функцию** в `useSettingsState.js`:

```javascript
const myNewAction = useCallback(async () => {
  try {
    // Ваша логика
    await doSomething();
  } catch (error) {
    console.warn('Action failed:', error);
  }
}, []);

return {
  ...
  actions: { 
    openFeedback, 
    rateApp,
    myNewAction,  // 👈 Добавить
  },
};
```

2. **Использовать**:

```javascript
const { actions } = useSettings();

<Button onPress={actions.myNewAction} />
```

### Добавить side effect

В `useSettingsState.js`:

```javascript
// Реагировать на изменение настройки
useEffect(() => {
  if (!isReady) return;
  
  if (settings.myNewSetting) {
    // Выполнить что-то при включении
    setupFeature();
  } else {
    // Очистить при выключении
    cleanupFeature();
  }
}, [settings.myNewSetting, isReady]);
```

## ⚠️ Важные замечания

### 1. Не используйте вне SettingsProvider

```javascript
// ❌ Ошибка: useSettings вне Provider
function App() {
  const { settings } = useSettings();  // Бросит ошибку!
  
  return <SettingsProvider>...</SettingsProvider>;
}

// ✅ Правильно: useSettings внутри Provider
function App() {
  return (
    <SettingsProvider>
      <MyApp />  {/* Здесь можно использовать useSettings */}
    </SettingsProvider>
  );
}
```

### 2. Проверяйте isReady для критичных операций

```javascript
// ❌ Небезопасно
const { settings } = useSettings();
initializeWithSettings(settings);  // Могут быть не загружены!

// ✅ Безопасно
const { settings, isReady } = useSettings();
useEffect(() => {
  if (isReady) {
    initializeWithSettings(settings);
  }
}, [isReady, settings]);
```

### 3. Side effects только в useSettingsState

```javascript
// ❌ Плохо: side effect в компоненте
function MyComponent() {
  const { settings } = useSettings();
  
  useEffect(() => {
    if (settings.notifications) {
      requestPermissions();  // Дублируется в каждом компоненте
    }
  }, [settings.notifications]);
}

// ✅ Хорошо: side effect в useSettingsState
// Выполняется один раз для всего приложения
```

## 🧪 Тестирование

### Mock для тестов

```javascript
// __mocks__/useSettings.js
export const useSettings = () => ({
  settings: {
    notifications: true,
    soundEffects: true,
    darkTheme: false,
    // ...
  },
  toggle: jest.fn(),
  setSettings: jest.fn(),
  actions: {
    openFeedback: jest.fn(),
    rateApp: jest.fn(),
  },
  appVersion: '1.0.0',
  isReady: true,
});
```

### Тестирование компонента

```javascript
import { useSettings } from '../features/settings';

jest.mock('../features/settings');

test('renders with dark theme', () => {
  useSettings.mockReturnValue({
    settings: { darkTheme: true },
    // ...
  });
  
  const { getByText } = render(<MyComponent />);
  // assertions...
});
```

## 📖 Дополнительно

- [Полная архитектура](./ARCHITECTURE.md)
- [Settings feature README](./src/features/settings/README.md)
- [React Context docs](https://react.dev/learn/passing-data-deeply-with-context)

