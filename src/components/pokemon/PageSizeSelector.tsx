import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Eye } from 'lucide-react';

interface PageSizeSelectorProps {
    currentSize: number;
    onSizeChange: (size: number) => void;
}

const presetSizes = [5, 10, 20, 50, 100];

export function PageSizeSelector({ currentSize, onSizeChange }: PageSizeSelectorProps) {
    const [isCustomMode, setIsCustomMode] = useState(!presetSizes.includes(currentSize));
    const [customValue, setCustomValue] = useState(currentSize.toString());

    const handleCustomSubmit = () => {
        const value = parseInt(customValue);
        if (value >= 1 && value <= 100) {
            onSizeChange(value);
            setIsCustomMode(false);
        }
    };

    const handleCustomKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCustomSubmit();
        }
        if (e.key === 'Escape') {
            setIsCustomMode(false);
            setCustomValue(currentSize.toString());
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 min-w-[80px]">
                        <Eye className="w-3 h-3" />
                        {currentSize}
                        <ChevronDown className="w-3 h-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-40">
                    {presetSizes.map(size => (
                        <DropdownMenuItem
                            key={size}
                            onClick={() => onSizeChange(size)}
                            className={currentSize === size ? 'bg-gray-100' : ''}
                        >
                            <div className="flex items-center justify-between w-full">
                                <span>{size} items</span>
                                {currentSize === size && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                            </div>
                        </DropdownMenuItem>
                    ))}

                    <div className="px-2 py-1 border-t border-gray-100">
                        {isCustomMode ? (
                            <div className="flex flex-col gap-2">
                                <Input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={customValue}
                                    onChange={(e) => setCustomValue(e.target.value)}
                                    onKeyDown={handleCustomKeyPress}
                                    onBlur={handleCustomSubmit}
                                    placeholder="1-100"
                                    className="h-8 text-xs"
                                    autoFocus
                                />
                                <div className="text-xs text-gray-500">
                                    Press Enter to apply
                                </div>
                            </div>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsCustomMode(true);
                                    setCustomValue(currentSize.toString());
                                }}
                                className="w-full h-8 text-xs justify-start"
                            >
                                Custom amount...
                            </Button>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}