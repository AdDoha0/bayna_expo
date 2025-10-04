# Settings Feature - Архитектура

## 📁 Структура

```
settings/
├── model/              # Доменная логика настроек
│   ├── useSettingsState.js    # Хук с состоянием и персистенсом
│   ├── SettingsContext.js     # React Context Provider/Consumer
│   └── index.js               # Реэкспорт
├── components/         # UI компоненты
│   ├── SettingItem.js         # Переключатель настройки
│   ├── ActionItem.js          # Кликабельный элемент
│   └── SettingsSection.js     # Группа настроек
├── screens/           # Экраны
│   └── SettingsScreen.js      # Главный экран настроек
└── index.js           # Публичный API фичи

```

## 🏗 Архитектурные решения

### Domain-Driven Design
Логика настроек живет в `model/`, отдельно от UI компонентов. Это позволяет:
- Переиспользовать логику без UI
- Легко тестировать бизнес-логику
- Изолировать изменения

### Context API Pattern
```javascript
// В App.js (корень приложения)
<SettingsProvider>
  <ThemedApp />
</SettingsProvider>

// В любом компоненте
const { settings, toggle, actions } = useSettings();
```

**Преимущества:**
- Единственный источник правды для всего приложения
- Нет проблем с синхронизацией между экранами
- Автоматическое обновление всех подписчиков

### Automatic Persistence
- Настройки автоматически сохраняются в AsyncStorage
- Ключ: `app.settings.v1`
- Hydration при запуске приложения
- `isReady` флаг предотвращает рендер до загрузки

## 🔧 Использование

### Добавление новой настройки

1. **Добавить в DEFAULTS** (`useSettingsState.js`):
```javascript
const DEFAULTS = {
  ...
  myNewSetting: false,  // 👈 добавить здесь
};
```

2. **Использовать в компоненте**:
```javascript
const { settings, toggle } = useSettings();

<SettingItem
  value={settings.myNewSetting}
  onToggle={() => toggle('myNewSetting')}
/>
```

### Добавление action handler

1. **Создать функцию** в `useSettingsState.js`:
```javascript
const myAction = useCallback(async () => {
  // ваша логика
}, []);

return {
  ...
  actions: { ..., myAction },
};
```

2. **Использовать**:
```javascript
const { actions } = useSettings();
<ActionItem onPress={actions.myAction} />
```

### Добавление side effect

В `useSettingsState.js` добавить новый `useEffect`:
```javascript
useEffect(() => {
  if (!isReady) return;
  
  if (settings.mySetting) {
    // выполнить side effect
  }
}, [settings.mySetting, isReady]);
```

## 🎨 Темизация

Приложение поддерживает светлую и темную тему через настройку `darkTheme`.

### Как работает

1. `settings.darkTheme` хранит выбор пользователя
2. `createAppTheme(isDark)` возвращает соответствующую тему
3. `PaperProvider` применяет тему ко всем компонентам
4. Tab bar и StatusBar адаптируются автоматически

### Расширение темы

В `src/shared/constants/theme.js`:
```javascript
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#8B5CF6',     // 👈 изменить цвета
    background: '#0F172A',
    // ...
  },
};
```

## 📦 Публичный API

Фича экспортирует через `src/features/settings/index.js`:

```javascript
// Context API
export { SettingsProvider, useSettings };

// UI Components (для внешнего использования)
export { SettingItem, ActionItem, SettingsSection };

// Screens (для навигации)
export { SettingsScreen };
```

## 🔐 Best Practices

1. **Всегда используйте `useSettings()`** вместо прямого доступа к AsyncStorage
2. **Проверяйте `isReady`** перед критичными операциями
3. **Side effects только в `useSettingsState`**, не в компонентах
4. **Новые настройки добавляйте в `DEFAULTS`** с дефолтным значением
5. **Actions изолируйте в хуке**, не в UI компонентах

## 🚀 Масштабирование

При росте числа настроек можно:

1. **Разбить на категории**:
```javascript
const DEFAULTS = {
  notifications: { daily: true, push: true },
  appearance: { theme: 'light', fontSize: 16 },
  // ...
};
```

2. **Создать селекторы**:
```javascript
export function useNotificationSettings() {
  const { settings } = useSettings();
  return settings.notifications;
}
```

3. **Вынести персистентность**:
```javascript
// model/persistence.js
export const settingsStorage = { ... };
```

## 📝 Миграции

При изменении структуры настроек:

1. Изменить `STORAGE_KEY` на `app.settings.v2`
2. Добавить миграционную логику в hydration
3. Удалить старый ключ после успешной миграции

