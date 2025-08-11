import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';

const MESSAGES_TABLE = 'chat_messages';

export function useRealtimeChat({ roomName, username }) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Get initial messages from table
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages for room:', roomName);
        
        // Extract community ID from roomName
        const communityId = roomName.replace('community_', '');
        
        const { data, error } = await supabase
          .from(MESSAGES_TABLE)
          .select('*')
          .eq('community_id', communityId)
          .order('created_at', { ascending: true });
        
        if (error) {
          if (error.code !== 'PGRST116') {
            console.error('Error loading messages:', error);
          }
        }
        
        // Set messages regardless (empty array if no messages)
        const messageData = data || [];
        console.log('Loaded messages:', messageData.length, 'messages');
        setMessages(messageData);
        
      } catch (error) {
        console.error('Unexpected error fetching messages:', error);
        // Set empty array on error
        setMessages([]);
      }
    };
    
    if (roomName && username) {
      fetchMessages();
    }
  }, [roomName, username]);

  // Subscribe to new INSERT events for this community
  useEffect(() => {
    if (!roomName || !username) return;

    console.log('Setting up real-time subscription for room:', roomName);
    
    // Extract community ID from roomName
    const communityId = roomName.replace('community_', '');
    
    const channel = supabase
      .channel(`room-${roomName}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: MESSAGES_TABLE,
          filter: `community_id=eq.${communityId}`,
        },
        (payload) => {
          console.log('New message received:', payload.new);
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      console.log('Cleaning up subscription for room:', roomName);
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [roomName, username]);

  // Insert a new message into chat_messages table
  const sendMessage = useCallback(
    async (content, userData = {}) => {
      if (!content || !content.trim()) return;
      
      try {
        console.log('Sending message:', content, 'to room:', roomName);
        
        const communityId = roomName.replace('community_', '');
        
        // Get current user ID from Supabase auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('User not authenticated:', userError);
          return;
        }
        
        const { data, error } = await supabase
          .from(MESSAGES_TABLE)
          .insert({
            message: content.trim(),
            user_id: user.id,
            community_id: parseInt(communityId),
            user_email: userData.user_email || user.email,
          })
          .select()
          .single();
        
        if (error) {
          console.error('Send message error:', error);
          throw error;
        }
        
        console.log('Message sent successfully:', data);
        
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [roomName, username]
  );

  return { 
    messages, 
    sendMessage, 
    isConnected 
  };
}