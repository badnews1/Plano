/**
 * Тестовый файл для проверки импортов
 * Удалить после проверки
 */

// Проверка импортов из system.ts
import { Loader2, CheckCircle, LogOut } from '@/shared/assets/icons/system';

// Проверка импортов из UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Проверка импортов из contexts
import { useAuth } from '@/app/contexts';

// Если этот файл компилируется без ошибок, значит все импорты работают
export const testImports = {
  Loader2,
  CheckCircle,
  LogOut,
  Button,
  Input,
  Label,
  useAuth,
};
