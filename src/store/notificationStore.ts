import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '../types';

// ============================================
// TYPES
// ============================================

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

// ============================================
// MOCK NOTIFICATIONS
// ============================================

const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'booking_request',
    title: 'Nuova prenotazione',
    message: 'Maria L. ha richiesto un Massaggio Rilassante per domani alle 10:00',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min fa
    data: { bookingId: 'book-001' },
  },
  {
    id: 'notif-002',
    type: 'booking_confirmed',
    title: 'Prenotazione confermata',
    message: 'Il tuo appuntamento con Giulia R. e stato confermato',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 ore fa
    data: { bookingId: 'book-002' },
  },
  {
    id: 'notif-003',
    type: 'reminder',
    title: 'Promemoria',
    message: 'Hai un appuntamento domani alle 15:00 con Marco B.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 giorno fa
    data: { bookingId: 'book-003' },
  },
  {
    id: 'notif-004',
    type: 'review',
    title: 'Nuova recensione',
    message: 'Giuseppe R. ha lasciato una recensione a 5 stelle',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 giorni fa
    data: { reviewId: 'rev-001' },
  },
];

// ============================================
// STORE
// ============================================

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter((n) => !n.read).length,

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notif-${Date.now()}`,
          read: false,
          createdAt: new Date(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (notificationId) => {
        set((state) => {
          const notification = state.notifications.find(
            (n) => n.id === notificationId
          );
          const wasUnread = notification && !notification.read;

          return {
            notifications: state.notifications.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            ),
            unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      removeNotification: (notificationId) => {
        set((state) => {
          const notification = state.notifications.find(
            (n) => n.id === notificationId
          );
          const wasUnread = notification && !notification.read;

          return {
            notifications: state.notifications.filter(
              (n) => n.id !== notificationId
            ),
            unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
          };
        });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'treat-u-notifications',
    }
  )
);
