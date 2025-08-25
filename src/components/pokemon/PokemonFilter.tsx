import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';
import { PokemonType } from '@/types/pokemon';

interface PokemonFiltersProps {
    search: string;
    type: string;
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
}

const pokemonTypes = Object.values(PokemonType);

export function PokemonFilters({
                                   search,
                                   type,
                                   onSearchChange,
                                   onTypeChange,
                               }: PokemonFiltersProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Search Pokémon</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        id="search"
                        type="text"
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
            </div>

            {/* Type Filter */}
            <div className="lg:w-48">
                <Label htmlFor="type-select" className="sr-only">Filter by Type</Label>
                <Select value={type} onValueChange={onTypeChange}>
                    <SelectTrigger id="type-select">
                        <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {pokemonTypes.map(pokemonType => (
                            <SelectItem key={pokemonType} value={pokemonType}>
                                {pokemonType.toLowerCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
