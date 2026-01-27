import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  ChevronLeft,
  MessageCircle,
  Clock,
  CheckCheck,
  Check,
} from 'lucide-react';
import { Button, Card, Avatar, EmptyState } from '../../components/shared';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { Conversation, Message } from '../../types';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { it } from 'date-fns/locale';

// ============================================
// CHAT PAGE
// ============================================

export function ChatPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const userId = user?.id || 'client-1';

  if (conversationId) {
    return <ChatConversation conversationId={conversationId} userId={userId} />;
  }

  return <ChatList userId={userId} />;
}

// ============================================
// CONVERSATION LIST
// ============================================

function ChatList({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const { getConversations } = useChatStore();
  const conversations = getConversations(userId);

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <EmptyState
          icon={<MessageCircle className="w-8 h-8" />}
          title="Nessuna conversazione"
          description="Le conversazioni con i professionisti appariranno qui quando prenoti un trattamento."
          action={{
            label: 'Cerca un professionista',
            onClick: () => navigate('/search'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messaggi</h1>

        <div className="space-y-2">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              userId={userId}
              onClick={() => navigate(`/chat/${conversation.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ConversationItem({
  conversation,
  userId,
  onClick,
}: {
  conversation: Conversation;
  userId: string;
  onClick: () => void;
}) {
  const isClient = conversation.participants.clientId === userId;
  const otherName = isClient
    ? conversation.participants.professionalName
    : conversation.participants.clientName;
  const otherAvatar = isClient
    ? conversation.participants.professionalAvatar
    : conversation.participants.clientAvatar;

  const lastMsg = conversation.lastMessage;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left"
    >
      <Avatar src={otherAvatar} name={otherName} size="lg" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">{otherName}</h3>
          {lastMsg && (
            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
              {formatMessageTime(lastMsg.createdAt)}
            </span>
          )}
        </div>
        {lastMsg && (
          <div className="flex items-center gap-2 mt-1">
            {lastMsg.senderId === userId && (
              <span className="text-xs text-gray-400">Tu:</span>
            )}
            <p className="text-sm text-gray-500 truncate">{lastMsg.content}</p>
          </div>
        )}
      </div>
      {conversation.unreadCount > 0 && (
        <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">
            {conversation.unreadCount}
          </span>
        </div>
      )}
    </button>
  );
}

// ============================================
// CONVERSATION VIEW
// ============================================

function ChatConversation({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) {
  const navigate = useNavigate();
  const { conversations, getMessages, sendMessage, markAsRead } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find((c) => c.id === conversationId);
  const messages = getMessages(conversationId);

  const isClient = conversation?.participants.clientId === userId;
  const otherName = isClient
    ? conversation?.participants.professionalName
    : conversation?.participants.clientName;
  const otherAvatar = isClient
    ? conversation?.participants.professionalAvatar
    : conversation?.participants.clientAvatar;

  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId, userId);
    }
  }, [conversationId, userId, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    sendMessage(
      conversationId,
      userId,
      isClient ? 'client' : 'professional',
      trimmed
    );
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <EmptyState
          title="Conversazione non trovata"
          description="Questa conversazione non esiste."
          action={{
            label: 'Torna ai messaggi',
            onClick: () => navigate('/chat'),
          }}
        />
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/chat')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Avatar src={otherAvatar} name={otherName} size="md" />
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{otherName}</h2>
            <p className="text-xs text-gray-500">
              {conversation.bookingId
                ? 'Relativo a una prenotazione'
                : 'Conversazione'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {groupedMessages.map((group) => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="flex items-center justify-center mb-4">
                <span className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600 font-medium">
                  {group.label}
                </span>
              </div>

              {/* Messages in group */}
              <div className="space-y-2">
                <AnimatePresence>
                  {group.messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.senderId === userId}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi un messaggio..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex-shrink-0 rounded-xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MESSAGE BUBBLE
// ============================================

function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
          isOwn
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div
          className={`flex items-center gap-1 mt-1 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}
        >
          <span
            className={`text-[10px] ${
              isOwn ? 'text-primary-200' : 'text-gray-400'
            }`}
          >
            {format(message.createdAt, 'HH:mm')}
          </span>
          {isOwn && (
            message.read ? (
              <CheckCheck className="w-3 h-3 text-primary-200" />
            ) : (
              <Check className="w-3 h-3 text-primary-300" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// HELPERS
// ============================================

function formatMessageTime(date: Date): string {
  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return 'Ieri';
  return format(date, 'dd/MM');
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; label: string; messages: Message[] }[] = [];

  messages.forEach((msg) => {
    const dateKey = format(msg.createdAt, 'yyyy-MM-dd');
    let label: string;

    if (isToday(msg.createdAt)) {
      label = 'Oggi';
    } else if (isYesterday(msg.createdAt)) {
      label = 'Ieri';
    } else {
      label = format(msg.createdAt, 'd MMMM yyyy', { locale: it });
    }

    const existing = groups.find((g) => g.date === dateKey);
    if (existing) {
      existing.messages.push(msg);
    } else {
      groups.push({ date: dateKey, label, messages: [msg] });
    }
  });

  return groups;
}
