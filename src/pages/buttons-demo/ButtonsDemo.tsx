/**
 * Демо-страница всех вариантов кнопок
 * 
 * Показывает все доступные варианты компонента Button из shadcn/ui:
 * - Все варианты (variants): default, destructive, outline, secondary, ghost, link
 * - Все размеры (sizes): default, sm, lg, icon
 * - Disabled состояния
 * - Варианты с иконками
 * 
 * @module pages/buttons-demo
 * @created 12 декабря 2025
 */

import { Button } from '@/components/ui/button';
import { PageContainer } from '@/shared/ui/page-container';
import { 
  Plus, 
  Trash2, 
  Check, 
  Settings, 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  Download,
  Upload,
  Heart,
  Star,
  Bell
} from '@/shared/assets/icons/system';

export function ButtonsDemo() {
  return (
    <PageContainer title="Buttons Demo">
      <div className="space-y-12 max-w-5xl mx-auto">
        
        {/* Варианты кнопок */}
        <section>
          <h2 className="mb-6 pb-3 border-b border-[var(--border-secondary)]">
            Варианты (Variants)
          </h2>
          
          <div className="space-y-6">
            {/* Default */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Default</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default Button</Button>
                <Button variant="default" disabled>Disabled</Button>
                <Button variant="default">
                  <Plus />
                  With Icon
                </Button>
                <Button variant="default">
                  Loading
                  <Loader2 className="animate-spin" />
                </Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Фон: <code>--primary (#6366F1)</code>, Текст: <code>--primary-foreground (#f5f5f5)</code>
              </p>
            </div>

            {/* Destructive */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Destructive</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="destructive">Delete</Button>
                <Button variant="destructive" disabled>Disabled</Button>
                <Button variant="destructive">
                  <Trash2 />
                  Remove Item
                </Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Фон: <code>--destructive</code>, Текст: <code>--destructive-foreground</code>
              </p>
            </div>

            {/* Outline */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Outline</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Outline Button</Button>
                <Button variant="outline" disabled>Disabled</Button>
                <Button variant="outline">
                  <Settings />
                  Settings
                </Button>
                <Button variant="outline">
                  Continue
                  <ChevronRight />
                </Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Прозрачный фон, граница: <code>border</code>, Текст: <code>--foreground</code>
              </p>
            </div>

            {/* Secondary */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Secondary</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">Secondary</Button>
                <Button variant="secondary" disabled>Disabled</Button>
                <Button variant="secondary">
                  <ArrowLeft />
                  Back
                </Button>
                <Button variant="secondary">
                  <Download />
                  Download
                </Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Фон: <code>--secondary (#f3f4f6)</code>, Текст: <code>--secondary-foreground (#111827)</code>, Граница: <code>--border-tertiary (#d1d5db)</code>
              </p>
            </div>

            {/* Tertiary */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Tertiary</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="tertiary">Tertiary</Button>
                <Button variant="tertiary" disabled>Disabled</Button>
                <Button variant="tertiary">
                  <Settings />
                  Settings
                </Button>
                <Button variant="tertiary">
                  <Star />
                  Favorite
                </Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Фон: <code>--bg-tertiary</code>, Граница: <code>--border-tertiary</code>, Текст: <code>--text-primary</code>
              </p>
            </div>

            {/* Ghost */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Ghost</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="ghost" disabled>Disabled</Button>
                <Button variant="ghost">
                  <Bell />
                  Notifications
                </Button>
                <Button variant="ghost">
                  <Upload />
                  Upload
                </Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Прозрачный фон, hover: <code>--accent</code>
              </p>
            </div>

            {/* Ghost Destructive */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Ghost Destructive</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="ghostDestructive">Delete</Button>
                <Button variant="ghostDestructive" disabled>Disabled</Button>
                <Button variant="ghostDestructive">
                  <Trash2 />
                  Remove
                </Button>
                <Button variant="ghostDestructive" size="icon">
                  <Trash2 />
                </Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Прозрачный фон, красный текст с прозрачностью 70% → 100% при hover
              </p>
            </div>

            {/* Link */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Link</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="link">Link Button</Button>
                <Button variant="link" disabled>Disabled</Button>
                <Button variant="link">
                  Learn More
                  <ChevronRight />
                </Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Текстовая кнопка с подчёркиванием, цвет: <code>--primary</code>
              </p>
            </div>
          </div>
        </section>

        {/* Размеры */}
        <section>
          <h2 className="mb-6 pb-3 border-b border-[var(--border-secondary)]">
            Размеры (Sizes)
          </h2>
          
          <div className="space-y-6">
            {/* Default размер */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Default (h-9 / 36px)</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="default">Default Size</Button>
                <Button size="default" variant="secondary">
                  <Plus />
                  Add Item
                </Button>
                <Button size="default" variant="outline">Action</Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Высота: <code>h-9 (36px)</code>, Padding: <code>px-4 py-2</code>
              </p>
            </div>

            {/* Small размер */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Small (h-8 / 32px)</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm">Small Button</Button>
                <Button size="sm" variant="secondary">
                  <Check />
                  Confirm
                </Button>
                <Button size="sm" variant="outline">Cancel</Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Высота: <code>h-8 (32px)</code>, Padding: <code>px-3</code>
              </p>
            </div>

            {/* Large размер */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Large (h-10 / 40px)</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="lg">Large Button</Button>
                <Button size="lg" variant="secondary">
                  <Star />
                  Favorite
                </Button>
                <Button size="lg" variant="outline">Options</Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Высота: <code>h-10 (40px)</code>, Padding: <code>px-6</code>
              </p>
            </div>

            {/* Icon размер */}
            <div>
              <h3 className="text-sm text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Icon (квадратная 36x36)</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="icon">
                  <Plus />
                </Button>
                <Button size="icon" variant="secondary">
                  <Settings />
                </Button>
                <Button size="icon" variant="outline">
                  <Heart />
                </Button>
                <Button size="icon" variant="ghost">
                  <Trash2 />
                </Button>
                <Button size="icon" variant="destructive">
                  <Trash2 />
                </Button>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Размер: <code>size-9 (36x36px)</code> — квадратная кнопка только с иконкой
              </p>
            </div>
          </div>
        </section>

        {/* Комбинации */}
        <section>
          <h2 className="mb-6 pb-3 border-b border-[var(--border-secondary)]">
            Практические примеры
          </h2>
          
          <div className="space-y-8">
            {/* Группа кнопок форм */}
            <div className="p-6 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
              <h3 className="text-sm mb-4">Кнопки формы</h3>
              <div className="flex gap-3">
                <Button>
                  <Check />
                  Save Changes
                </Button>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </div>

            {/* Тулбар */}
            <div className="p-6 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
              <h3 className="text-sm mb-4">Тулбар с иконками</h3>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost">
                  <Plus />
                </Button>
                <Button size="icon" variant="ghost">
                  <Settings />
                </Button>
                <Button size="icon" variant="ghost">
                  <Download />
                </Button>
                <div className="w-px bg-[var(--border-secondary)] mx-2" />
                <Button size="icon" variant="ghost">
                  <Trash2 />
                </Button>
              </div>
            </div>

            {/* Карточка с действиями */}
            <div className="p-6 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
              <h3 className="text-sm mb-4">Карточка с действиями</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Пример карточки с разными кнопками</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">Описание элемента</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </div>

            {/* Все размеры в ряд */}
            <div className="p-6 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
              <h3 className="text-sm mb-4">Сравнение размеров</h3>
              <div className="flex gap-3 items-center">
                <Button size="sm" variant="secondary">Small</Button>
                <Button size="default" variant="secondary">Default</Button>
                <Button size="lg" variant="secondary">Large</Button>
                <Button size="icon" variant="secondary">
                  <Star />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Состояния */}
        <section>
          <h2 className="mb-6 pb-3 border-b border-[var(--border-secondary)]">
            Состояния
          </h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button>
                <Loader2 className="animate-spin" />
                Loading
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">Normal</Button>
              <Button variant="secondary" disabled>Disabled</Button>
              <Button variant="secondary">
                <Loader2 className="animate-spin" />
                Processing
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">Normal</Button>
              <Button variant="outline" disabled>Disabled</Button>
            </div>
          </div>
        </section>

      </div>
    </PageContainer>
  );
}