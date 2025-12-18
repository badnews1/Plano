/**
 * Демо-страница Email-шаблонов
 * 
 * Позволяет просмотреть все email-шаблоны проекта в браузере
 * без необходимости отправки реальных писем.
 * 
 * @module pages/email-templates-demo
 * @created 17 декабря 2025
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Типы шаблонов
type TemplateType = 'confirm-signup' | 'confirm-signup-en' | 'reset-password' | 'change-email' | 'magic-link';

interface TemplateOption {
  id: TemplateType;
  title: string;
  description: string;
}

const templates: TemplateOption[] = [
  {
    id: 'confirm-signup',
    title: 'Подтверждение регистрации (RU)',
    description: 'Письмо для подтверждения email при регистрации',
  },
  {
    id: 'confirm-signup-en',
    title: 'Email Confirmation (EN)',
    description: 'Email confirmation after signup',
  },
  {
    id: 'reset-password',
    title: 'Сброс пароля',
    description: 'Письмо для восстановления пароля',
  },
  {
    id: 'change-email',
    title: 'Изменение email',
    description: 'Подтверждение нового email-адреса',
  },
  {
    id: 'magic-link',
    title: 'Magic Link',
    description: 'Вход без пароля (одноразовая ссылка)',
  },
];

export function EmailTemplatesDemo() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('confirm-signup');

  // Заглушки для переменных Supabase
  const mockVariables = {
    confirmationUrl: 'https://yourapp.com/confirm?token=abc123def456...',
    token: 'abc123def456',
    siteUrl: 'https://yourapp.com',
    email: 'user@example.com',
    userName: 'Иван Иванов',
    currentYear: new Date().getFullYear(),
  };

  // Функция генерации HTML с подставленными переменными
  const generateHTML = (templateId: TemplateType): string => {
    const htmlTemplates: Record<TemplateType, string> = {
      'confirm-signup': `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Подтверждение регистрации</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
  
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366F1 100%); padding: 40px 40px 32px 40px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; line-height: 1.3;">
                Добро пожаловать! 👋
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              
              <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                Здравствуйте<span style="font-weight: 500;">, ${mockVariables.userName}!</span>
              </p>
              
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Спасибо за регистрацию! Осталось подтвердить ваш email-адрес, чтобы начать пользоваться всеми возможностями приложения.
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${mockVariables.confirmationUrl}" 
                       style="display: inline-block; background-color: #6366F1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 500; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2); transition: background-color 0.2s;">
                      Подтвердить Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Или скопируйте эту ссылку в браузер:
              </p>
              
              <p style="margin: 8px 0 0 0; padding: 12px; background-color: #f3f4f6; border-radius: 8px; word-break: break-all; font-size: 13px; color: #4b5563;">
                <a href="${mockVariables.confirmationUrl}" style="color: #6366F1; text-decoration: none;">${mockVariables.confirmationUrl}</a>
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 32px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.5;">
                      <strong>⚠️ Важно:</strong> Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5; text-align: center;">
                Это автоматическое письмо, пожалуйста, не отвечайте на него.
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 13px; line-height: 1.5; text-align: center;">
                © ${mockVariables.currentYear} Habit Tracker. Все права защищены.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
      `,
      'confirm-signup-en': `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
  
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366F1 100%); padding: 40px 40px 32px 40px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; line-height: 1.3;">
                Welcome! 👋
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              
              <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                Hello, ${mockVariables.userName}!
              </p>
              
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for signing up! Please confirm your email address to start using all the features of the app.
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${mockVariables.confirmationUrl}" 
                       style="display: inline-block; background-color: #6366F1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 500; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);">
                      Confirm Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Or copy this link into your browser:
              </p>
              
              <p style="margin: 8px 0 0 0; padding: 12px; background-color: #f3f4f6; border-radius: 8px; word-break: break-all; font-size: 13px; color: #4b5563;">
                <a href="${mockVariables.confirmationUrl}" style="color: #6366F1; text-decoration: none;">${mockVariables.confirmationUrl}</a>
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 32px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.5;">
                      <strong>⚠️ Important:</strong> If you didn't sign up for our service, please ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5; text-align: center;">
                This is an automated email, please do not reply.
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 13px; line-height: 1.5; text-align: center;">
                © ${mockVariables.currentYear} Habit Tracker. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
      `,
      'reset-password': `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Сброс пароля</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
  
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="padding: 40px 40px 32px 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              
              <div style="width: 64px; height: 64px; margin: 0 auto 16px; background: linear-gradient(135deg, #6366F1, #818CF8); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px; line-height: 64px;">🔒</span>
              </div>
              
              <h1 style="margin: 0; color: #111827; font-size: 28px; font-weight: 600; line-height: 1.3;">
                Сброс пароля
              </h1>
              
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              
              <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                Здравствуйте!
              </p>
              
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Вы запросили сброс пароля для вашей учетной записи <strong style="color: #111827;">${mockVariables.email}</strong>. Нажмите на кнопку ниже, чтобы создать новый пароль.
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${mockVariables.confirmationUrl}" 
                       style="display: inline-block; background-color: #6366F1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 500; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);">
                      Сбросить пароль
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Или скопируйте эту ссылку в браузер:
              </p>
              
              <p style="margin: 8px 0 0 0; padding: 12px; background-color: #f3f4f6; border-radius: 8px; word-break: break-all; font-size: 13px; color: #4b5563;">
                <a href="${mockVariables.confirmationUrl}" style="color: #6366F1; text-decoration: none;">${mockVariables.confirmationUrl}</a>
              </p>
              
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                ⏱️ Ссылка действительна в течение <strong>1 часа</strong>
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 32px; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 8px 0; color: #7f1d1d; font-size: 14px; font-weight: 600;">
                      ⚠️ Важно!
                    </p>
                    <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.5;">
                      Если вы <strong>НЕ запрашивали</strong> сброс пароля, просто проигнорируйте это письмо. Ваш пароль останется прежним.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5; text-align: center;">
                По соображениям безопасности никому не сообщайте эту ссылку.
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 13px; line-height: 1.5; text-align: center;">
                © ${mockVariables.currentYear} Habit Tracker. Все права защищены.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
      `,
      'change-email': `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Подтверждение изменения email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
  
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="padding: 40px 40px 32px 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              
              <div style="width: 64px; height: 64px; margin: 0 auto 16px; background: linear-gradient(135deg, #06b6d4, #6366F1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px; line-height: 64px;">✉️</span>
              </div>
              
              <h1 style="margin: 0; color: #111827; font-size: 28px; font-weight: 600; line-height: 1.3;">
                Подтвердите новый email
              </h1>
              
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              
              <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                Здравствуйте!
              </p>
              
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Вы запросили изменение email-адреса для вашей учетной записи. Чтобы подтвердить новый адрес <strong style="color: #111827;">${mockVariables.email}</strong>, нажмите на кнопку ниже.
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${mockVariables.confirmationUrl}" 
                       style="display: inline-block; background-color: #6366F1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 500; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);">
                      Подтвердить новый Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Или скопируйте эту ссылку в браузер:
              </p>
              
              <p style="margin: 8px 0 0 0; padding: 12px; background-color: #f3f4f6; border-radius: 8px; word-break: break-all; font-size: 13px; color: #4b5563;">
                <a href="${mockVariables.confirmationUrl}" style="color: #6366F1; text-decoration: none;">${mockVariables.confirmationUrl}</a>
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 32px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                      ℹ️ Что произойдет после подтверждения?
                    </p>
                    <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                      После подтверждения новый email-адрес станет основным для вашей учетной записи. Все уведомления будут приходить на новый адрес.
                    </p>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 8px 0; color: #7f1d1d; font-size: 14px; font-weight: 600;">
                      ⚠️ Важно!
                    </p>
                    <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.5;">
                      Если вы <strong>НЕ запрашивали</strong> изменение email, немедленно свяжитесь со службой поддержки. Это может указывать на несанкционированный доступ к вашей учетной записи.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5; text-align: center;">
                Это автоматическое письмо, пожалуйста, не отвечайте на него.
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 13px; line-height: 1.5; text-align: center;">
                © ${mockVariables.currentYear} Habit Tracker. Все права защищены.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
      `,
      'magic-link': `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Вход по ссылке</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
  
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #8b5cf6 0%, #6366F1 100%); padding: 40px 40px 32px 40px; border-radius: 10px 10px 0 0; text-align: center;">
              
              <div style="width: 72px; height: 72px; margin: 0 auto 16px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                <span style="font-size: 36px; line-height: 72px;">⚡</span>
              </div>
              
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; line-height: 1.3;">
                Быстрый вход
              </h1>
              
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 15px;">
                Войдите одним кликом без пароля
              </p>
              
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              
              <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                Здравствуйте!
              </p>
              
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Кто-то запросил вход в учетную запись <strong style="color: #111827;">${mockVariables.email}</strong>. Нажмите на кнопку ниже, чтобы войти — пароль не требуется! 🎉
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${mockVariables.confirmationUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366F1); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 16px; font-weight: 500; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                      ✨ Войти в приложение
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Или скопируйте эту ссылку в браузер:
              </p>
              
              <p style="margin: 8px 0 0 0; padding: 12px; background-color: #f3f4f6; border-radius: 8px; word-break: break-all; font-size: 13px; color: #4b5563;">
                <a href="${mockVariables.confirmationUrl}" style="color: #6366F1; text-decoration: none;">${mockVariables.confirmationUrl}</a>
              </p>
              
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                ⏱️ Ссылка действительна в течение <strong>1 часа</strong>
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 32px; background-color: #f0f9ff; border-left: 4px solid #06b6d4; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">
                      💡 Что такое Magic Link?
                    </p>
                    <p style="margin: 0; color: #0c4a6e; font-size: 14px; line-height: 1.5;">
                      Это безопасный способ входа без необходимости запоминать пароль. Просто кликните по ссылке — и вы в системе!
                    </p>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 8px 0; color: #7f1d1d; font-size: 14px; font-weight: 600;">
                      🔒 Безопасность
                    </p>
                    <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.5;">
                      Если это были не вы, просто проигнорируйте это письмо. Никто не сможет войти в вашу учетную запись без доступа к этому письму.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5; text-align: center;">
                По соображениям безопасности никому не пересылайте это письмо.
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 13px; line-height: 1.5; text-align: center;">
                © ${mockVariables.currentYear} Habit Tracker. Все права защищены.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
      `,
    };

    return htmlTemplates[templateId];
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h2 className="text-text-primary mb-2">Email Templates Demo</h2>
        <p className="text-text-secondary">
          Демонстрация всех email-шаблонов проекта. Переменные Supabase заменены на тестовые значения.
        </p>
      </div>

      {/* Сетка с кнопками и превью */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка: Список шаблонов */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="text-text-primary mb-4">Выберите шаблон</h3>
            <div className="space-y-2">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? 'default' : 'outline'}
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div>
                    <div className="font-medium">{template.title}</div>
                    <div className="text-xs text-text-tertiary mt-1">{template.description}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Информация о переменных */}
            <div className="mt-6 pt-6 border-t border-border-secondary">
              <h4 className="text-text-secondary mb-2">Тестовые значения:</h4>
              <div className="text-xs text-text-tertiary space-y-1">
                <div><strong>Email:</strong> {mockVariables.email}</div>
                <div><strong>Имя:</strong> {mockVariables.userName}</div>
                <div><strong>Год:</strong> {mockVariables.currentYear}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Правая колонка: Превью */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-primary">
                {templates.find((t) => t.id === selectedTemplate)?.title}
              </h3>
              <div className="text-xs text-text-tertiary">
                Масштаб: 100%
              </div>
            </div>
            
            {/* iframe с шаблоном */}
            <div className="border border-border-secondary rounded-lg overflow-hidden bg-white">
              <iframe
                srcDoc={generateHTML(selectedTemplate)}
                title={`Email Template: ${selectedTemplate}`}
                className="w-full h-[600px]"
                sandbox="allow-same-origin"
              />
            </div>

            {/* Подсказка */}
            <div className="mt-4 p-4 bg-bg-tertiary rounded-lg">
              <p className="text-xs text-text-secondary">
                💡 <strong>Подсказка:</strong> Это демо-версия для разработки. 
                Для использования в Supabase скопируйте HTML из папки <code className="bg-bg-primary px-1 rounded">/email-templates/</code>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}