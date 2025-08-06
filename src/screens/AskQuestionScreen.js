import { React, useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, FlatList, TextInput, Button, StyleSheet, Platform, SafeAreaView } from "react-native";
import { supabase } from "../utils/hooks/supabase";
import { GiftedChat } from "react-native-gifted-chat";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { useRealtimeChat } from "../hooks/use-realtime-chat";
import { useChatScroll } from "../hooks/use-chat-scroll";


export default function AskQuestionScreen({ route, navigation }) {
    const { user } = useAuthentication();
    const username = user?.email || 'Guest';

  

    const { messages, sendMessage, isConnected} = useRealtimeChat({
        roomName: 'Have a question? We have answers.',
        username
         
    });

    const [input, setInput] = useState('');
    const { containerRef, scrollToBottom } = useChatScroll();

    const handleSend = () => {
    if (input.trim() !== '') {
      sendMessage(input.trim());
      setInput('');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Group Chat</Text>
      <FlatList
        ref = {containerRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          
          const messageUser = item.user?.name.split("@")[0] || item.user_email.split("@")[0]|| 'Unknown';
          const isSender = messageUser === username.split("@")[0];
          
          return(
          <Text style={[styles.message, isSender?styles.senderText : styles.otherText]}>
            <Text style={styles.username}>{messageUser} </Text>
             {'\n'}
            {/* { item.user?.name.split("@")[0] || item.user_email.split("@")[0] || 'Unknown'}:{" "}:  */}
            <Text style={styles.message}>{item.content}</Text>
            
          </Text>

          );
        }}
        onContentSizeChange={scrollToBottom}

      />
      
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Your question(s) here..."
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  message: { paddingVertical: 4, fontSize: 16},
  username: { fontWeight: 'bold' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  senderText: {
    color: 'darkred'
  },
  otherText: {
    color: 'black'
  },

});
