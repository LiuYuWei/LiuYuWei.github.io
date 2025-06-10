
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDown, Check } from 'lucide-react';
import type { Workshop } from '@/lib/types';

interface WorkshopSwitcherDropdownProps {
  currentWorkshopId: string;
  workshops: Workshop[];
}

export default function WorkshopSwitcherDropdown({ currentWorkshopId, workshops }: WorkshopSwitcherDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentWorkshop = workshops.find(w => w.id === currentWorkshopId);

  const handleWorkshopChange = (workshopId: string) => {
    router.push(`/workshops/${workshopId}`);
    setIsOpen(false);
  };

  if (workshops.length <= 1) {
    return null; // Don't show switcher if only one or no workshops
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={isOpen} className="w-[200px] justify-between text-sm">
          <span className="truncate">
            {currentWorkshop ? currentWorkshop.name : '選擇工作坊'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-0">
        <DropdownMenuLabel>選擇工作坊</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workshops.map((workshop) => (
          <DropdownMenuItem
            key={workshop.id}
            onSelect={() => handleWorkshopChange(workshop.id)}
            className="text-sm cursor-pointer"
          >
            <Check
              className={`mr-2 h-4 w-4 ${currentWorkshopId === workshop.id ? 'opacity-100' : 'opacity-0'}`}
            />
            <span className="truncate">{workshop.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
