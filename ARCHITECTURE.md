# Архитектура приложения Bayna Yadayk

## 🏗️ Общая структура

```
App (Root)
  └─ SettingsProvider                    # Context для глобальных настроек
      └─ ThemedApp                       # Потребитель настроек + темизация
          └─ PaperProvider               # React Native Paper с динамической темой
              └─ NavigationContainer     # React Navigation
                  └─ MainTabNavigator    # Нижняя навигация
                      ├─ DialogsStack    # Стек навигации для диалогов
                      ├─ VocabularyTab   # Словарь
                      ├─ ProgressTab     # Прогресс
                      └─ SettingsTab     # Настройки
```

## 📂 Структура проекта

```
src/
├── features/                    # Фичи приложения (Domain-Driven)
│   ├── dialogs/                # Диалоги
│   │   ├── components/         # UI компоненты диалогов
│   │   ├── data/              # Данные диалогов
│   │   └── screens/           # Экраны
│   │
│   ├── vocabulary/            # Словарь
│   │   ├── components/        # UI компоненты словаря
│   │   ├── data/             # Данные слов
│   │   └── screens/          # Экраны
│   │
│   ├── progress/             # Прогресс обучения
│   │   ├── components/       # Графики, карточки статистики
│   │   ├── sections/         # Секции экрана
│   │   └── screens/          # Экраны
│   │
│   └── settings/             # ⭐ Настройки (с глобальным стейтом)
│       ├── model/            # 🔥 Доменная логика
│       │   ├── useSettingsState.js   # Хук с состоянием + персистенс
│       │   ├── SettingsContext.js    # Context Provider/Consumer
│       │   └── index.js              # Реэкспорты
│       ├── components/       # UI компоненты настроек
│       ├── screens/          # Экран настроек
│       └── index.js          # Публичный API фичи
│
└── shared/                   # Общие утилиты и компоненты
    ├── components/          # Переиспользуемые UI компоненты
    │   ├── layout/         # Screen, AnimatedHeader
    │   ├── ui/            # Card, Chip
    │   └── feedback/      # LoadingScreen
    ├── constants/         # Константы и темы
    │   └── theme.js       # 🎨 Светлая/темная тема + factory
    └── utils/            # Утилиты
```

## 🔄 Поток данных настроек

```
┌─────────────────────────────────────────────────────────────────┐
│ AsyncStorage (app.settings.v1)                                  │
│ { notifications: true, darkTheme: false, ... }                  │
└──────────────────┬──────────────────────────────────────────────┘
                   │ Hydration on mount
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│ useSettingsState (Custom Hook)                                  │
│ - useState для in-memory стейта                                 │
│ - useEffect для hydration/persistence                           │
│ - Side effects (notifications permissions)                      │
│ - Action handlers (openFeedback, rateApp)                       │
└──────────────────┬──────────────────────────────────────────────┘
                   │ Provide via Context
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│ SettingsContext.Provider                                        │
│ value = { settings, toggle, actions, appVersion, isReady }      │
└──────────────────┬──────────────────────────────────────────────┘
                   │ Consume from anywhere
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│ useSettings() Hook                                              │
│ - Доступен в любом компоненте                                   │
│ - Бросает ошибку если вне Provider                              │
└──────────────────┬──────────────────────────────────────────────┘
                   │ Used by
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│ Consumers                                                       │
│ ├─ ThemedApp → определяет тему                                  │
│ ├─ SettingsScreen → отображает/изменяет настройки               │
│ └─ (любой другой компонент)                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Система темизации

```
User toggles darkTheme setting
         │
         ▼
useSettings().toggle('darkTheme')
         │
         ▼
settings.darkTheme = true
         │
         ▼
createAppTheme(true) → returns darkTheme
         │
         ▼
<PaperProvider theme={darkTheme}>
         │
         ▼
┌────────────────────────────────────────────────────┐
│ Все компоненты автоматически используют тему:     │
│ - Surface цвет меняется на #1E293B                │
│ - Background на #0F172A                           │
│ - Primary на #8B5CF6                              │
│ - Text цвета адаптируются                         │
│ - Tab bar адаптируется                            │
│ - StatusBar меняет стиль                          │
└────────────────────────────────────────────────────┘
```

## 🔌 Context API vs Props Drilling

### ❌ Раньше (Props Drilling)
```javascript
// Передавать настройки через 5+ уровней компонентов
App → Navigator → Screen → Section → Component
```

### ✅ Теперь (Context API)
```javascript
// Прямой доступ откуда угодно
function AnyComponent() {
  const { settings } = useSettings();
  // Используем настройки
}
```

## 💾 Персистентность

```
Settings изменились
         ↓
useEffect срабатывает
         ↓
AsyncStorage.setItem('app.settings.v1', JSON.stringify(settings))
         ↓
Сохранено на устройстве
         ↓
При следующем запуске приложения:
         ↓
AsyncStorage.getItem('app.settings.v1')
         ↓
setState(stored_settings)
         ↓
isReady = true → рендерим приложение
```

## 🎯 Ключевые принципы

### 1. Domain-Driven Design
- Каждая фича (`dialogs`, `vocabulary`, `progress`, `settings`) — отдельный домен
- Логика домена живет внутри фичи, не размазана по всему проекту
- `settings/model/` содержит всю бизнес-логику настроек

### 2. Single Source of Truth
- Один стейт настроек для всего приложения
- Нет дублирования данных
- Нет проблем с синхронизацией

### 3. Separation of Concerns
```
model/               → Бизнес-логика (без React)
components/          → Презентационные компоненты (только UI)
screens/             → Композиция компонентов
```

### 4. Clean Public API
```javascript
// Фича экспортирует только то, что нужно снаружи
export { SettingsProvider, useSettings };  // API
// Внутренние детали (useSettingsState) не экспортируются
```

## 🚀 Расширяемость

### Добавить новую настройку
1. Добавить в `DEFAULTS` в `useSettingsState.js`
2. Готово! Автоматически сохраняется и загружается

### Добавить новый action
1. Создать функцию в `useSettingsState.js`
2. Добавить в `return { actions: { ... } }`
3. Использовать через `useSettings().actions.myAction()`

### Добавить side effect
1. Добавить `useEffect` в `useSettingsState.js`
2. Реагировать на изменения нужной настройки

### Добавить новую тему
1. Расширить `theme.js` новым вариантом
2. Обновить `createAppTheme()` factory

## 📊 Преимущества архитектуры

✅ **Масштабируемость** - легко добавлять новые фичи и настройки
✅ **Тестируемость** - логика изолирована от UI
✅ **Поддерживаемость** - понятная структура, легко найти код
✅ **Производительность** - Context обновляет только подписчиков
✅ **Типобезопасность** - единая точка истины для настроек
✅ **DX** - удобный API (`useSettings()` в любом месте)
✅ **Переиспользование** - доменная логика не зависит от UI

## 🔐 Best Practices

1. **Держите доменную логику в `model/`**, не смешивайте с компонентами
2. **Используйте Context для глобального стейта**, не пробрасывайте props
3. **Один Provider на домен** (не создавайте Provider для каждой настройки)
4. **Проверяйте `isReady`** перед критичными операциями
5. **Side effects только в хуках**, не в компонентах
6. **Экспортируйте только публичный API**, скрывайте детали реализации

