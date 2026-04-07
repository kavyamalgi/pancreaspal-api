import { create } from 'zustand';

export const useChatStore = create((set) => ({
  conversations: {},
  currentConversationId: null,
  currentMessages: [],
  isLoading: false,
  error: null,

  setConversations: (conversations) => set({ conversations }),
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  setMessages: (messages) => set({ currentMessages: messages }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  addMessage: (message) => set((state) => ({
    currentMessages: [...state.currentMessages, message]
  })),

  createConversation: (conversationId, patientId) => set((state) => ({
    conversations: {
      ...state.conversations,
      [conversationId]: {
        id: conversationId,
        patientId,
        messages: [],
        createdAt: new Date().toISOString()
      }
    },
    currentConversationId: conversationId,
    currentMessages: []
  })),

  loadConversation: (conversationId) => set((state) => {
    const conversation = state.conversations[conversationId];
    if (conversation) {
      return {
        currentConversationId: conversationId,
        currentMessages: conversation.messages || []
      };
    }
    return {};
  }),

  clearChat: () => set({
    currentMessages: [],
    currentConversationId: null
  })
}));
