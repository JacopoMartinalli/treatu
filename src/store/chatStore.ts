import { create } from 'zustand';
import { Conversation, Message } from '../types';

// ============================================
// MOCK DATA
// ============================================

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: {
      clientId: 'client-1',
      clientName: 'Marco Bianchi',
      clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      professionalId: 'pro-1',
      professionalName: 'Giulia Rossi',
      professionalAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    bookingId: 'book-1',
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    lastMessage: {
      id: 'msg-4',
      conversationId: 'conv-1',
      senderId: 'pro-1',
      senderRole: 'professional',
      content: 'Perfetto, ci vediamo domani alle 10! Preparo tutto per il massaggio decontratturante.',
      type: 'text',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
  },
  {
    id: 'conv-2',
    participants: {
      clientId: 'client-1',
      clientName: 'Marco Bianchi',
      clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      professionalId: 'pro-2',
      professionalName: 'Luca Verdi',
      professionalAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    lastMessage: {
      id: 'msg-8',
      conversationId: 'conv-2',
      senderId: 'client-1',
      senderRole: 'client',
      content: 'Grazie mille, a presto!',
      type: 'text',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
  },
];

const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'client-1',
      senderRole: 'client',
      content: 'Ciao Giulia! Ho prenotato un massaggio decontratturante per domani. Volevo chiederti se devo preparare qualcosa di particolare.',
      type: 'text',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'pro-1',
      senderRole: 'professional',
      content: 'Ciao Marco! Non serve nulla di particolare. Assicurati solo di avere un letto o un divano abbastanza grande dove stenderti. Portero io il lettino se preferisci.',
      type: 'text',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      senderId: 'client-1',
      senderRole: 'client',
      content: 'Ottimo, se puoi portare il lettino sarebbe perfetto! Ho il salotto abbastanza spazioso.',
      type: 'text',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 'msg-4',
      conversationId: 'conv-1',
      senderId: 'pro-1',
      senderRole: 'professional',
      content: 'Perfetto, ci vediamo domani alle 10! Preparo tutto per il massaggio decontratturante.',
      type: 'text',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
  ],
  'conv-2': [
    {
      id: 'msg-5',
      conversationId: 'conv-2',
      senderId: 'pro-2',
      senderRole: 'professional',
      content: 'Ciao! Ho visto la tua prenotazione. Ti confermo che saro da te venerdi alle 15.',
      type: 'text',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: 'msg-6',
      conversationId: 'conv-2',
      senderId: 'client-1',
      senderRole: 'client',
      content: 'Perfetto! C\'e parcheggio nel cortile interno, citofona pure "Bianchi".',
      type: 'text',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
    {
      id: 'msg-7',
      conversationId: 'conv-2',
      senderId: 'pro-2',
      senderRole: 'professional',
      content: 'Ottimo, grazie per le indicazioni! Il massaggio e andato bene, spero ti sia piaciuto.',
      type: 'text',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    },
    {
      id: 'msg-8',
      conversationId: 'conv-2',
      senderId: 'client-1',
      senderRole: 'client',
      content: 'Grazie mille, a presto!',
      type: 'text',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
  ],
};

// ============================================
// STORE
// ============================================

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;

  getConversations: (userId: string) => Conversation[];
  getMessages: (conversationId: string) => Message[];
  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, senderId: string, senderRole: 'client' | 'professional', content: string) => void;
  markAsRead: (conversationId: string, userId: string) => void;
  getTotalUnread: (userId: string) => number;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [...mockConversations],
  messages: { ...mockMessages },
  activeConversationId: null,

  getConversations: (userId) => {
    return get().conversations
      .filter(
        (c) =>
          c.participants.clientId === userId ||
          c.participants.professionalId === userId
      )
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  },

  getMessages: (conversationId) => {
    return get().messages[conversationId] || [];
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
  },

  sendMessage: (conversationId, senderId, senderRole, content) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderRole,
      content,
      type: 'text',
      read: false,
      createdAt: new Date(),
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          newMessage,
        ],
      },
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: newMessage, updatedAt: new Date() }
          : c
      ),
    }));
  },

  markAsRead: (conversationId, userId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((m) =>
          m.senderId !== userId ? { ...m, read: true } : m
        ),
      },
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },

  getTotalUnread: (userId) => {
    return get()
      .conversations.filter(
        (c) =>
          c.participants.clientId === userId ||
          c.participants.professionalId === userId
      )
      .reduce((sum, c) => sum + c.unreadCount, 0);
  },
}));
