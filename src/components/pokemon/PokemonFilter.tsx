import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PokemonFiltersProps {
    search: string;
    type: string;
    onSearchChange: (search: string) => void;
    onTypeChange: (type: string) => void;
}

const POKEMON_TYPES = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic',
    'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];

export function PokemonFilters({ search, type, onSearchChange, onTypeChange }: PokemonFiltersProps) {
    const [searchValue, setSearchValue] = useState(search);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(searchValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue, onSearchChange]);

    const clearFilters = () => {
        setSearchValue('');
        onTypeChange('');
    };

    const handleTypeChange = (value: string) => {
        if (value === 'all') {
            onTypeChange('');
        } else {
            onTypeChange(value);
        }
    };
    const hasActiveFilters = search || type;

    return (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm border">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Search Pokémon..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-10 pr-4"
                />
            </div>

            <Select value={type || 'all'} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {POKEMON_TYPES.map((pokemonType) => (
                        <SelectItem key={pokemonType} value={pokemonType}>
                            {pokemonType}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {hasActiveFilters && (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={clearFilters}
                    className="shrink-0"
                    title="Clear filters"
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}