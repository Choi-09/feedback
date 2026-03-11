'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NonSubmittersBadgeProps {
  names: string[];
  category: string;
}

export function NonSubmittersBadge({
  names,
  category,
}: NonSubmittersBadgeProps) {
  if (names.length === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
        <span className="size-1.5 rounded-full bg-green-500" />
        <span>&#10003; 전원 제출</span>
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900">
        <span className="size-1.5 rounded-full bg-red-500" />
        미제출 {names.length}명
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {category.toUpperCase()} 미제출자
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {names.map((name) => (
            <DropdownMenuItem key={name} className="text-sm">
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
