import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-8 pb-4 border-b border-border">
      <div className="flex items-center gap-3 mb-1">
        {Icon && <Icon className="h-8 w-8 text-primary shrink-0" />}
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      </div>
      <p className="text-md text-muted-foreground">{description}</p>
    </div>
  );
}
