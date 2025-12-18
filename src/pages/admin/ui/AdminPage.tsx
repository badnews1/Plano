/**
 * Страница админской панели
 * 
 * Доступна только пользователям с ролью admin.
 * Содержит:
 * - Статистику (общие цифры)
 * - Таблицу пользователей
 * - Действия с пользователями
 * - Демо Email-шаблонов
 * 
 * @module pages/admin/ui/AdminPage
 * @created 17 декабря 2025
 * @updated 17 декабря 2025 - добавлены вкладки и Email Templates Demo
 */

import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/shared/ui';
import { AdminDashboard } from '@/widgets/admin-dashboard';
import { AdminUsersTable } from '@/widgets/admin-users-table';
import { EmailTemplatesDemo } from '@/pages/email-templates-demo';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';

export const AdminPage = () => {
  const { t } = useTranslation('admin');
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Заголовок */}
        <div>
          <h1>{t('admin.title')}</h1>
          <p className="text-muted-foreground">
            {t('admin.dashboard')}
          </p>
        </div>

        {/* Вкладки */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="dashboard">
              Панель управления
            </TabsTrigger>
            <TabsTrigger value="email-templates">
              Email Шаблоны
            </TabsTrigger>
          </TabsList>

          {/* Вкладка: Панель управления */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Dashboard со статистикой */}
            <AdminDashboard />

            {/* Таблица пользователей */}
            <AdminUsersTable />
          </TabsContent>

          {/* Вкладка: Email Шаблоны */}
          <TabsContent value="email-templates">
            <EmailTemplatesDemo />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};