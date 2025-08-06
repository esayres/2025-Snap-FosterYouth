import { useCallback, useRef } from 'react';

export function useChatScroll() {
  const containerRef = useRef(null); // For FlatList or ScrollView

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollToEnd({ animated: true });
    }
  }, []);

  return { containerRef, scrollToBottom };
}
