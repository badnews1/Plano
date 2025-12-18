import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Создаём Supabase клиент
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-05bdbe69/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ENDPOINTS ====================

/**
 * Регистрация нового пользователя
 * POST /make-server-05bdbe69/signup
 * Body: { email, password, name?, preferredLanguage? }
 */
app.post("/make-server-05bdbe69/signup", async (c) => {
  try {
    const { email, password, name, preferredLanguage } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Проверяем, есть ли уже зарегистрированные пользователи
    const { data: { users: existingUsers }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error checking existing users:', listError);
    }

    // Если это первый пользователь - делаем его админом
    const isFirstUser = !existingUsers || existingUsers.length === 0;
    const userRole = isFirstUser ? 'admin' : 'user';

    // Создаём пользователя
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name: name || email.split('@')[0],
        role: userRole,
        preferredLanguage: preferredLanguage || 'en', // Сохраняем язык браузера
      },
      // Автоматически подтверждаем email, так как сервер email не настроен
      email_confirm: true,
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    if (isFirstUser) {
      console.log(`🎉 Первый пользователь зарегистрирован как ADMIN: ${email} (язык: ${preferredLanguage || 'en'})`);
    } else {
      console.log(`✅ Новый пользователь зарегистрирован: ${email} (язык: ${preferredLanguage || 'en'})`);
    }

    return c.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role,
        preferredLanguage: data.user.user_metadata.preferredLanguage,
      }
    });
  } catch (error) {
    console.error('Signup exception:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

/**
 * Проверка авторизации пользователя
 * GET /make-server-05bdbe69/me
 * Headers: Authorization: Bearer <access_token>
 */
app.get("/make-server-05bdbe69/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
        role: user.user_metadata.role || 'user',
        avatar_url: user.user_metadata.avatar_url,
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * Обновить профиль пользователя
 * PUT /make-server-05bdbe69/profile
 * Headers: Authorization: Bearer <access_token>
 * Body: { name?, avatar_url?, email?, preferredLanguage? }
 */
app.put("/make-server-05bdbe69/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Profile update auth error:', error);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    // Получаем данные для обновления
    const { name, avatar_url, preferredLanguage, email } = await c.req.json();

    // Обновляем метаданные пользователя
    const updateData: any = {
      user_metadata: {
        ...user.user_metadata,
        ...(name !== undefined && { name }),
        ...(avatar_url !== undefined && { avatar_url }),
        ...(preferredLanguage !== undefined && { preferredLanguage }),
      }
    };

    // Если передан новый email, обновляем его
    if (email !== undefined && email !== user.email) {
      // Валидация формата email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return c.json({ error: 'Неверный формат email' }, 400);
      }

      // Проверяем, что email не занят другим пользователем
      const { data: { users: existingUsers }, error: checkError } = await supabase.auth.admin.listUsers();
      
      if (checkError) {
        console.error('Ошибка проверки уникальности email:', checkError);
        return c.json({ error: 'Ошибка проверки email' }, 500);
      }

      // Ищем пользователя с таким же email (кроме текущего)
      const emailTaken = existingUsers?.some(
        (existingUser) => existingUser.email === email && existingUser.id !== user.id
      );

      if (emailTaken) {
        return c.json({ error: 'Этот email уже используется другим пользователем' }, 400);
      }

      updateData.email = email;
      // email_confirm: true автоматически подтверждает новый email
      updateData.email_confirm = true;
    }

    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      updateData
    );

    if (updateError) {
      console.error('Profile update error:', updateError);
      
      // Детальная обработка ошибок
      if (updateError.message?.includes('email')) {
        return c.json({ error: 'Ошибка обновления email. Возможно, этот email уже используется.' }, 400);
      }
      
      if (updateError.message?.includes('unique')) {
        return c.json({ error: 'Этот email уже зарегистрирован в системе' }, 400);
      }
      
      return c.json({ error: 'Не удалось обновить профиль. Попробуйте позже.' }, 500);
    }

    console.log('✅ Профиль обновлен для пользователя:', user.email);

    return c.json({ 
      success: true,
      user: {
        id: updatedUser.user.id,
        email: updatedUser.user.email,
        name: updatedUser.user.user_metadata.name,
        role: updatedUser.user.user_metadata.role,
        avatar_url: updatedUser.user.user_metadata.avatar_url,
        preferredLanguage: updatedUser.user.user_metadata.preferredLanguage,
      }
    });
  } catch (error) {
    console.error('Profile update exception:', error);
    return c.json({ error: 'Internal server error during profile update' }, 500);
  }
});

/**
 * Изменить пароль пользователя
 * PUT /make-server-05bdbe69/change-password
 * Headers: Authorization: Bearer <access_token>
 * Body: { currentPassword, newPassword }
 */
app.put("/make-server-05bdbe69/change-password", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Требуется авторизация' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Change password auth error:', error);
      return c.json({ error: 'Неверный токен авторизации' }, 401);
    }

    // Получаем данные из запроса
    const { currentPassword, newPassword } = await c.req.json();

    if (!currentPassword || !newPassword) {
      return c.json({ error: 'Необходимо указать текущий и новый пароль' }, 400);
    }

    if (newPassword.length < 6) {
      return c.json({ error: 'Новый пароль должен содержать минимум 6 символов' }, 400);
    }

    // Проверяем текущий пароль через попытку входа
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) {
      console.error('Current password verification failed:', signInError);
      return c.json({ error: 'Неверный текущий пароль' }, 400);
    }

    // Обновляем пароль
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        password: newPassword,
      }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return c.json({ error: 'Не удалось обновить пароль' }, 500);
    }

    console.log('✅ Пароль изменен для пользователя:', user.email);

    return c.json({ 
      success: true,
      message: 'Пароль успешно изменен',
    });
  } catch (error) {
    console.error('Change password exception:', error);
    return c.json({ error: 'Internal server error during password change' }, 500);
  }
});

// ==================== ADMIN ENDPOINTS ====================

/**
 * Получить статистику для админской панели
 * GET /make-server-05bdbe69/admin/stats
 * Headers: Authorization: Bearer <access_token>
 */
app.get("/make-server-05bdbe69/admin/stats", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Проверяем что пользователь админ
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user || user.user_metadata.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    // Получаем всех пользователей для подсчета статистики
    const { data: { users: authUsers }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users for stats:', usersError);
      return c.json({ error: 'Failed to fetch stats' }, 500);
    }

    // Считаем статистику
    const totalUsers = authUsers.length;
    
    // Активные пользователи - те, кто заходил за последние 7 дней
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = authUsers.filter(u => {
      const lastSignIn = u.last_sign_in_at ? new Date(u.last_sign_in_at) : new Date(u.created_at);
      return lastSignIn >= sevenDaysAgo;
    }).length;

    // TODO: После создания таблицы привычек - получать реальные данные
    const totalHabits = 0;
    const avgHabitsPerUser = totalUsers > 0 ? totalHabits / totalUsers : 0;

    const stats = {
      totalUsers,
      activeUsers,
      totalHabits,
      avgHabitsPerUser,
    };

    return c.json({ stats });
  } catch (error) {
    console.error('Admin stats error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * Получить список пользователей
 * GET /make-server-05bdbe69/admin/users
 * Headers: Authorization: Bearer <access_token>
 */
app.get("/make-server-05bdbe69/admin/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Проверяем что пользователь админ
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user || user.user_metadata.role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    // Получаем всех пользователей из Supabase Auth
    const { data: { users: authUsers }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users from Supabase Auth:', usersError);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    // Форматируем данные для фронтенда
    const users = authUsers.map(u => ({
      id: u.id,
      email: u.email || '',
      name: u.user_metadata?.name || u.email?.split('@')[0] || 'Unknown',
      role: u.user_metadata?.role || 'user',
      habitsCount: 0, // TODO: получать из реальных данных привычек
      joinedAt: u.created_at,
      status: u.banned_until ? 'blocked' : 'active',
    }));

    return c.json({ users });
  } catch (error) {
    console.error('Admin users error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== HABITS ENDPOINTS ====================

/**
 * Получить все привычки текущего пользователя
 * GET /make-server-05bdbe69/habits
 * Headers: Authorization: Bearer <access_token>
 */
app.get("/make-server-05bdbe69/habits", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    // Проверяем авторизацию пользователя
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error) {
      console.error('Get habits auth error:', error);
      // Если пользователь не найден - возвращаем 401 для автоматического logout на фронтенде
      if (error.status === 403 || error.code === 'user_not_found') {
        return c.json({ error: 'User not found - please login again', code: 'user_not_found' }, 401);
      }
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }
    
    if (!user) {
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    // Получаем привычки пользователя из KV store
    const userHabitsKey = `user:${user.id}:habits`;
    const habits = await kv.get(userHabitsKey) || [];

    return c.json({ habits });
  } catch (error) {
    console.error('Get habits error:', error);
    return c.json({ error: 'Internal server error while fetching habits' }, 500);
  }
});

/**
 * Создать новую привычку для текущего пользователя
 * POST /make-server-05bdbe69/habits
 * Headers: Authorization: Bearer <access_token>
 * Body: { habit: Habit }
 */
app.post("/make-server-05bdbe69/habits", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    // Проверяем авторизацию пользователя
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Create habit auth error:', error);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    const { habit } = await c.req.json();
    
    if (!habit) {
      return c.json({ error: 'Habit data is required' }, 400);
    }

    // Получаем текущие привычки пользователя
    const userHabitsKey = `user:${user.id}:habits`;
    const habits = await kv.get(userHabitsKey) || [];

    // Добавляем новую привычку
    const newHabits = [...habits, habit];
    await kv.set(userHabitsKey, newHabits);

    console.log(`✅ Habit created for user ${user.email}:`, habit.name);

    return c.json({ habit, success: true });
  } catch (error) {
    console.error('Create habit error:', error);
    return c.json({ error: 'Internal server error while creating habit' }, 500);
  }
});

/**
 * Обновить привычку текущего пользователя
 * PUT /make-server-05bdbe69/habits/:id
 * Headers: Authorization: Bearer <access_token>
 * Body: { updates: Partial<Habit> }
 */
app.put("/make-server-05bdbe69/habits/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    // Проверяем авторизацию пользователя
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Update habit auth error:', error);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    const habitId = c.req.param('id');
    const { updates } = await c.req.json();
    
    if (!updates) {
      return c.json({ error: 'Updates data is required' }, 400);
    }

    // Получаем текущие привычки пользователя
    const userHabitsKey = `user:${user.id}:habits`;
    const habits = await kv.get(userHabitsKey) || [];

    // Находим и обновляем привычку
    const habitIndex = habits.findIndex((h: any) => h.id === habitId);
    
    if (habitIndex === -1) {
      return c.json({ error: 'Habit not found' }, 404);
    }

    habits[habitIndex] = { ...habits[habitIndex], ...updates };
    await kv.set(userHabitsKey, habits);

    console.log(`✅ Habit updated for user ${user.email}:`, habitId);

    return c.json({ habit: habits[habitIndex], success: true });
  } catch (error) {
    console.error('Update habit error:', error);
    return c.json({ error: 'Internal server error while updating habit' }, 500);
  }
});

/**
 * Удалить привычку текущего пользователя
 * DELETE /make-server-05bdbe69/habits/:id
 * Headers: Authorization: Bearer <access_token>
 */
app.delete("/make-server-05bdbe69/habits/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    // Проверяем авторизацию пользователя
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Delete habit auth error:', error);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    const habitId = c.req.param('id');

    // Получаем текущие привычки пользователя
    const userHabitsKey = `user:${user.id}:habits`;
    const habits = await kv.get(userHabitsKey) || [];

    // Удаляем привычку
    const newHabits = habits.filter((h: any) => h.id !== habitId);
    
    if (newHabits.length === habits.length) {
      return c.json({ error: 'Habit not found' }, 404);
    }

    await kv.set(userHabitsKey, newHabits);

    console.log(`✅ Habit deleted for user ${user.email}:`, habitId);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete habit error:', error);
    return c.json({ error: 'Internal server error while deleting habit' }, 500);
  }
});

/**
 * Синхронизация всех привычек (полная замена)
 * POST /make-server-05bdbe69/habits/sync
 * Headers: Authorization: Bearer <access_token>
 * Body: { habits: Habit[] }
 */
app.post("/make-server-05bdbe69/habits/sync", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    // Проверяем авторизацию пользователя
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Sync habits auth error:', error);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    const { habits } = await c.req.json();
    
    if (!Array.isArray(habits)) {
      return c.json({ error: 'Habits must be an array' }, 400);
    }

    // Полностью заменяем привычки пользователя
    const userHabitsKey = `user:${user.id}:habits`;
    await kv.set(userHabitsKey, habits);

    console.log(`✅ Habits synced for user ${user.email}: ${habits.length} habits`);

    return c.json({ success: true, count: habits.length });
  } catch (error) {
    console.error('Sync habits error:', error);
    return c.json({ error: 'Internal server error while syncing habits' }, 500);
  }
});

/**
 * Удалить аккаунт пользователя
 * DELETE /make-server-05bdbe69/delete-account
 * Headers: Authorization: Bearer <access_token>
 */
app.delete("/make-server-05bdbe69/delete-account", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    // Проверяем авторизацию пользователя
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Delete account auth error:', error);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    // Удаляем все данные пользователя из KV store
    const userHabitsKey = `user:${user.id}:habits`;
    const userSettingsKey = `user:${user.id}:settings`;
    await kv.del(userHabitsKey);
    await kv.del(userSettingsKey);

    // Удаляем пользователя из Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Delete user error:', deleteError);
      return c.json({ error: 'Failed to delete account' }, 500);
    }

    console.log(`🗑️ Аккаунт удален: ${user.email}`);

    return c.json({ 
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account exception:', error);
    return c.json({ error: 'Internal server error during account deletion' }, 500);
  }
});

// ==================== USER SETTINGS ENDPOINTS ====================

/**
 * Получить настройки пользователя
 * GET /make-server-05bdbe69/settings
 * Headers: Authorization: Bearer <access_token>
 */
app.get("/make-server-05bdbe69/settings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    // Проверяем авторизацию пользователя
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Get settings auth error:', error);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    // Получаем настройки пользователя из KV store
    const userSettingsKey = `user:${user.id}:settings`;
    const settings = await kv.get(userSettingsKey);

    if (!settings) {
      // Настройки не найдены (первый вход)
      return c.json({ error: 'Settings not found' }, 404);
    }

    return c.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return c.json({ error: 'Internal server error while fetching settings' }, 500);
  }
});

/**
 * Сохранить настройки пользователя
 * POST /make-server-05bdbe69/settings
 * Headers: Authorization: Bearer <access_token>
 * Body: { settings: UserSettings }
 */
app.post("/make-server-05bdbe69/settings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    // Проверяем авторизацию пользователя
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Save settings auth error:', error);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    const { settings } = await c.req.json();
    
    if (!settings) {
      return c.json({ error: 'Settings data is required' }, 400);
    }

    // Сохраняем настройки пользователя в KV store
    const userSettingsKey = `user:${user.id}:settings`;
    await kv.set(userSettingsKey, settings);

    console.log(`✅ Settings saved for user ${user.email}`);

    return c.json({ success: true, settings });
  } catch (error) {
    console.error('Save settings error:', error);
    return c.json({ error: 'Internal server error while saving settings' }, 500);
  }
});

Deno.serve(app.fetch);