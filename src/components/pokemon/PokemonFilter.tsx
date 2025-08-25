import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Plus } from 'lucide-react';
import { PokemonType } from '@/types/pokemon';
import { Link } from 'react-router-dom';

interface PokemonFiltersProps {
    search: string;
    type: string;
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
}

const pokemonTypes = Object.values(PokemonType);

export function PokemonFilters({ search, type, onSearchChange, onTypeChange }: PokemonFiltersProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search Pokémon by name..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-10"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <Select value={type} onValueChange={onTypeChange}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        {pokemonTypes.map((pokemonType) => (
                            <SelectItem key={pokemonType} value={pokemonType} className="capitalize">
                                {pokemonType.toLowerCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {(search || type) && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            onSearchChange('');
                            onTypeChange('');
                        }}
                        className="flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Clear Filters
                    </Button>
                )}
            </div>

            <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Pokémon
            </Button>
        </div>
    );
}