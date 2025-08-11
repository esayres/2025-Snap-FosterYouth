import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { useRealtimeChat } from "../utils/hooks/use-realtime-chat";
import { useChatScroll } from "../utils/hooks/use-chat-scroll";
import { supabase } from "../utils/hooks/supabase";

export default function GroupChatScreen({ route, navigation }) {
  const { communityId, communityName } = route.params;
  const { user } = useAuthentication();
  const username = user?.email || 'Guest';
  
  const { messages, sendMessage, isConnected } = useRealtimeChat({
    roomName: `community_${communityId}`,  // Room per community
    username: user?.email
  });

  const { containerRef, scrollToBottom } = useChatScroll();

  const [input, setInput] = useState('');
  const [userRole, setUserRole] = useState('member');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && communityId) {
      fetchUserRole();
      setLoading(false);
    }
  }, [user, communityId]);

  useEffect(() => {
    // Auto-scroll when new messages
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, scrollToBottom]);

  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select('role')
        .eq('community_id', communityId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setUserRole(data?.role || 'member');
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

const handleSend = () => {
  if (input.trim() !== '' && !loading) {
    // Pass user data when sending the message
    sendMessage(input.trim(), {
      user_email: user?.email,
      community_id: communityId,
      user_id: user?.id
    });
    setInput('');
    setTimeout(scrollToBottom, 150);
  }
};

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderMessage = ({ item }) => {
    // Get user email from the message data
    const messageUser = item.user_email?.split("@")[0] || 'Unknown';
    const isSender = messageUser === username.split("@")[0];
    
    // Check if this user is an admin
    const isBetterYouthAdmin = messageUser === 'betteryouth';
    const isAdmin = item.user_role === 'admin' || userRole === 'admin' && isSender || isBetterYouthAdmin;

    return (
      <View style={styles.messageContainer}>
        <View style={styles.userRow}>
          <View style={styles.userNameContainer}>
            <Text style={[
              styles.userName,
              isAdmin ? styles.adminUserName : styles.regularUserName
            ]}>
              {messageUser}
            </Text>
            {isAdmin && <Ionicons name="checkmark-circle" size={16} color="#00D4AA" style={styles.adminIcon} />}
          </View>
          <Text style={styles.timestamp}>
            {formatTime(item.created_at)}
          </Text>
        </View>
        <View style={styles.messageTextContainer}>
          <Text style={styles.messageText}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{communityName}</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={containerRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation! 💬</Text>
            </View>
          )}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim()) && styles.sendButtonDisabled
              ]}
              onPress={handleSend}
              disabled={!input.trim()}
            >
              <Ionicons name="send" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContainer: {
    paddingVertical: 16,
  },
  messageContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  adminIcon: {
    marginLeft: 4,
  },
  regularUserName: {
    color: '#007AFF',
  },
  adminUserName: {
    color: '#00AA00',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  messageTextContainer: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 20,
  },
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
    color: '#000',
    paddingVertical: 0,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});