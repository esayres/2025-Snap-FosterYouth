import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/hooks/supabase';

const MESSAGES_TABLE = 'test_messages';

export function useRealtimeChat({ roomName, username }) {
  const [messages, setMessages] = useState([]);

  // get initial messages from table
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from(MESSAGES_TABLE)
        .select('*')
        .eq('room', roomName)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [roomName]);

  // 2. Subscribe to new INSERT events for this room
  useEffect(() => {
    const channel = supabase
      .channel(`room-${roomName}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: MESSAGES_TABLE,
          filter: `room=eq.${roomName}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomName]);

  // 3. Insert a new message into test_messages
  const sendMessage = useCallback(
    async (content) => {
      const { error } = await supabase.from(MESSAGES_TABLE).insert({
        content,
        user_email: username,
        room: roomName,
      });

      if (error) {
        console.error('Send message error:', error);
      }
    },
    [roomName, username]
  );

  return { messages, sendMessage };
}
