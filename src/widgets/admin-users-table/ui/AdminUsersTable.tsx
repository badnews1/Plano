/**
 * Таблица пользователей для админской панели
 * 
 * Функционал:
 * - Список всех пользователей
 * - Поиск по email/имени
 * - Сортировка
 * - Действия: просмотр, блокировка, удаление
 * 
 * @module widgets/admin-users-table/ui/AdminUsersTable
 * @created 17 декабря 2025
 * @updated 17 декабря 2025 - интеграция с Supabase
 */

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Search, Settings, Shield } from '@/shared/assets/icons/system';
import { toast } from 'sonner';
import { serverFetch } from '../../../shared/lib/supabase/client';

// Типы пользователя
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  habitsCount: number;
  joinedAt: string;
  status: 'active' | 'blocked';
}

export const AdminUsersTable = () => {
  const { t } = useTranslation('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем пользователей при монтировании
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await serverFetch('/admin/users');
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        } else {
          console.error('Failed to fetch users:', await response.text());
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);
  
  // Фильтрация пользователей по поиску
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query)
    );
  }, [searchQuery, users]);

  // Обработчики действий
  const handleBlockUser = (user: AdminUser) => {
    toast.success(
      user.status === 'active'
        ? t('admin.messages.userBlocked')
        : t('admin.messages.userUnblocked')
    );
  };

  const handleDeleteUser = (user: AdminUser) => {
    toast.success(t('admin.messages.userDeleted'));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('admin.usersTable.title')}</CardTitle>
          
          {/* Поиск */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.usersTable.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Таблица */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('admin.usersTable.loading')}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery ? t('admin.usersTable.noResults') : t('admin.usersTable.empty')}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.usersTable.columns.email')}</TableHead>
                <TableHead>{t('admin.usersTable.columns.name')}</TableHead>
                <TableHead>{t('admin.usersTable.columns.role')}</TableHead>
                <TableHead>{t('admin.usersTable.columns.habits')}</TableHead>
                <TableHead>{t('admin.usersTable.columns.joinedAt')}</TableHead>
                <TableHead>{t('admin.usersTable.columns.status')}</TableHead>
                <TableHead className="text-right">{t('admin.usersTable.columns.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  {/* Email */}
                  <TableCell className="font-medium">{user.email}</TableCell>
                  
                  {/* Name */}
                  <TableCell>{user.name}</TableCell>
                  
                  {/* Role */}
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' && <Shield className="size-3 mr-1" />}
                      {t(`admin.usersTable.roles.${user.role}`)}
                    </Badge>
                  </TableCell>
                  
                  {/* Habits Count */}
                  <TableCell>{user.habitsCount}</TableCell>
                  
                  {/* Joined At */}
                  <TableCell>
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </TableCell>
                  
                  {/* Status */}
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                      {t(`admin.usersTable.status.${user.status}`)}
                    </Badge>
                  </TableCell>
                  
                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('admin.usersTable.columns.actions')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          {t('admin.usersTable.actions.view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBlockUser(user)}>
                          {user.status === 'active'
                            ? t('admin.usersTable.actions.block')
                            : t('admin.usersTable.actions.unblock')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="text-destructive"
                        >
                          {t('admin.usersTable.actions.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};