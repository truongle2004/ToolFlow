'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { WheelItem } from '../types';
import { getRandomColor } from '../utils/wheel';

interface WheelInputProps {
  items: WheelItem[];
  onAdd: (item: WheelItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function WheelInput({ items, onAdd, onRemove, onClear, disabled }: WheelInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Handle multiple names separated by commas or newlines
    const names = trimmed.split(/[\n,]/).map(n => n.trim()).filter(n => n.length > 0);
    
    names.forEach(name => {
      onAdd({
        id: crypto.randomUUID(),
        name,
        color: getRandomColor(),
      });
    });

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Card className="flex flex-col h-full border-none shadow-none md:border-solid md:shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Entries ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex gap-2">
          <Input 
            placeholder="Type a name and press Enter..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="flex-1"
          />
          <Button onClick={handleAdd} disabled={disabled || !inputValue.trim()}>
            Add
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[200px] bg-muted/30 rounded-md border p-2">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground pt-12 flex flex-col items-center">
              <p className="font-semibold text-lg">No entries yet</p>
              <p className="text-sm">Add some names above to start spinning!</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {items.map((item) => (
                <li 
                  key={item.id} 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/60 group transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemove(item.id)}
                    disabled={disabled}
                    className="opacity-0 group-hover:opacity-100 h-8 px-2 transition-opacity"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={onClear}
          disabled={disabled || items.length === 0}
        >
          Clear All Entries
        </Button>
      </CardFooter>
    </Card>
  );
}
