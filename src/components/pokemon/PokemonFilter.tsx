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

const typeColors: Record<PokemonType, string> = {
    [PokemonType.FIRE]: 'bg-red-500 text-white',
    [PokemonType.WATER]: 'bg-blue-500 text-white',
    [PokemonType.GRASS]: 'bg-green-500 text-white',
    [PokemonType.ELECTRIC]: 'bg-yellow-500 text-black',
    [PokemonType.PSYCHIC]: 'bg-purple-500 text-white',
    [PokemonType.ICE]: 'bg-cyan-400 text-black',
    [PokemonType.DRAGON]: 'bg-indigo-600 text-white',
    [PokemonType.DARK]: 'bg-gray-700 text-white',
    [PokemonType.FAIRY]: 'bg-pink-400 text-black',
    [PokemonType.FIGHTING]: 'bg-red-700 text-white',
    [PokemonType.POISON]: 'bg-purple-600 text-white',
    [PokemonType.GROUND]: 'bg-yellow-600 text-white',
    [PokemonType.FLYING]: 'bg-indigo-400 text-white',
    [PokemonType.BUG]: 'bg-green-600 text-white',
    [PokemonType.ROCK]: 'bg-yellow-800 text-white',
    [PokemonType.GHOST]: 'bg-purple-800 text-white',
    [PokemonType.STEEL]: 'bg-gray-500 text-white',
    [PokemonType.NORMAL]: 'bg-gray-400 text-white',
};
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
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${typeColors[pokemonType]}`}></div>
                                    <span className="capitalize">{pokemonType.toLowerCase()}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
