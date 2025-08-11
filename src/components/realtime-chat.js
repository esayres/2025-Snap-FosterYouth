import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChatMessageItem } from './ChatMessageItem'; // adjust path as needed
import { useChatScroll } from '../hooks/use-chat-scroll'; // custom hook
import { useRealtimeChat } from '../hooks/use-realtime-chat'; // custom hook
import { Send } from 'lucide-react-native'; // or use any icon library you prefer

export default function RealtimeChat({ roomName, username, onMessage, messages: initialMessages = [] }) {
  const { containerRef, scrollToBottom } = useChatScroll(); // You may need to adjust this for RN
  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  });

  const [newMessage, setNewMessage] = useState('');

  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages];
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) => index === self.findIndex((m) => m.id === message.id)
    );
    return uniqueMessages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [initialMessages, realtimeMessages]);

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages);
    }
  }, [allMessages, onMessage]);

  useEffect(() => {
    scrollToBottom?.(); // use scrollToEnd if ScrollView + ref used
  }, [allMessages]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !isConnected) return;

    sendMessage(newMessage);
    setNewMessage('');
  }, [newMessage, isConnected, sendMessage]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <ScrollView
          ref={containerRef}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => scrollToBottom?.()}
        >
          {allMessages.length === 0 ? (
            <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
          ) : null}

          {allMessages.map((message, index) => {
            const prevMessage = index > 0 ? allMessages[index - 1] : null;
            const showHeader = !prevMessage || prevMessage.user.name !== message.user.name;

            return (
              <View key={message.id} style={styles.messageWrapper}>
                <ChatMessageItem
                  message={message}
                  isOwnMessage={message.user.name === username}
                  showHeader={showHeader}
                />
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.input,
              isConnected && newMessage.trim() ? styles.inputShrunk : styles.inputFull,
            ]}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={newMessage}
            onChangeText={setNewMessage}
            editable={isConnected}
          />
          {isConnected && newMessage.trim() && (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={!isConnected}
            >
              <Send size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff', // replace with theme.bg if you have a theme
  },
  messageList: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginTop: 12,
  },
  messageWrapper: {
    marginBottom: 8,
    // Add animation if you want using Reanimated or LayoutAnimation
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    gap: 8,
  },
  input: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    fontSize: 14,
    color: '#000',
    flexGrow: 1,
  },
  inputFull: {
    flex: 1,
  },
  inputShrunk: {
    flex: 1,
    marginRight: 44,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
