/**
 * Store для управления данными пользователя
 * 
 * Содержит:
 * - Аватарка пользователя (base64 или URL)
 * - Методы для изменения аватарки
 * 
 * После интеграции с Supabase:
 * - avatar будет содержать URL из Supabase Storage
 * - setAvatar будет загружать файл в Supabase Storage
 * 
 * @module entities/user/model/userStore
 * @created 17 декабря 2025
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  // Аватарка пользователя (base64 или URL из Supabase Storage)
  avatar: string | null;
  
  // Установить новую аватарку
  setAvatar: (avatar: string) => void;
  
  // Удалить аватарку
  removeAvatar: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      avatar: null,
      
      setAvatar: (avatar: string) => {
        set({ avatar });
      },
      
      removeAvatar: () => {
        set({ avatar: null });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
