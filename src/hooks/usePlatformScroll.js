import { Platform, useEffect } from 'react';

export const usePlatformScroll = () => {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Принудительно включаем скроллинг для веб-версии
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.style.height = '100vh';
        rootElement.style.overflow = 'hidden';
      }

      // Добавляем CSS стили для скроллинга
      const style = document.createElement('style');
      style.textContent = `
        .rn-scrollview {
          overflow: auto !important;
          -webkit-overflow-scrolling: touch !important;
          height: 100% !important;
        }
        
        .scroll-container {
          overflow-y: auto !important;
          height: 100% !important;
          -webkit-overflow-scrolling: touch !important;
        }
        
        /* Кастомный скроллбар */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #6366F1;
          border-radius: 10px;
          opacity: 0.7;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #4338CA;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  const getScrollProps = () => {
    if (Platform.OS === 'web') {
      return {
        style: { 
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          height: '100%',
        },
        showsVerticalScrollIndicator: false,
        bounces: false,
        overScrollMode: 'auto',
        scrollEnabled: true,
        alwaysBounceVertical: false,
      };
    }
    
    return {
      showsVerticalScrollIndicator: false,
      bounces: true,
      scrollEventThrottle: 16,
      nestedScrollEnabled: true,
    };
  };

  return { getScrollProps };
}; 