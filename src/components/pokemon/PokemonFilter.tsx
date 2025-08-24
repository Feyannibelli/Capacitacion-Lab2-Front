import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PokemonFiltersProps {
    search: string;
    type: string;
    onSearchChange: (search: string) => void;
    onTypeChange: (type: string) => void;
}

const POKEMON_TYPES = [
    { name: 'Normal', color: 'bg-gray-400' },
    { name: 'Fire', color: 'bg-red-500' },
    { name: 'Water', color: 'bg-blue-500' },
    { name: 'Electric', color: 'bg-yellow-500' },
    { name: 'Grass', color: 'bg-green-500' },
    { name: 'Ice', color: 'bg-cyan-400' },
    { name: 'Fighting', color: 'bg-red-700' },
    { name: 'Poison', color: 'bg-purple-600' },
    { name: 'Ground', color: 'bg-yellow-600' },
    { name: 'Flying', color: 'bg-indigo-400' },
    { name: 'Psychic', color: 'bg-purple-500' },
    { name: 'Bug', color: 'bg-green-600' },
    { name: 'Rock', color: 'bg-yellow-800' },
    { name: 'Ghost', color: 'bg-purple-800' },
    { name: 'Dragon', color: 'bg-indigo-600' },
    { name: 'Dark', color: 'bg-gray-700' },
    { name: 'Steel', color: 'bg-gray-500' },
    { name: 'Fairy', color: 'bg-pink-400' },
];

export function PokemonFilters({ search, type, onSearchChange, onTypeChange }: PokemonFiltersProps) {
    const [searchValue, setSearchValue] = useState(search);
    const [isExpanded, setIsExpanded] = useState(false);

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

    const handleTypeSelect = (selectedType: string) => {
        if (selectedType === type) {
            onTypeChange(''); // Deselect if already selected
        } else {
            onTypeChange(selectedType);
        }
        setIsExpanded(false);
    };

    const hasActiveFilters = search || type;
    const selectedTypeData = POKEMON_TYPES.find(t => t.name === type);

    return (
        <div className="space-y-6">
            {/* Main Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                    placeholder="Search for a Pokémon..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-12 pr-4 h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-red-400 focus:ring-red-100"
                />
                {searchValue && (
                    <button
                        onClick={() => setSearchValue('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Type Filter Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-800">Filter by Type</h3>
                    </div>

                    <div className="flex items-center gap-3">
                        {selectedTypeData && (
                            <Badge
                                className={`${selectedTypeData.color} text-white flex items-center gap-2 px-3 py-1`}
                            >
                                {selectedTypeData.name}
                                <button
                                    onClick={() => onTypeChange('')}
                                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}

                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="text-gray-600 hover:text-red-600 hover:border-red-300"
                            >
                                Clear All
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            {isExpanded ? 'Show Less' : 'Show All Types'}
                        </Button>
                    </div>
                </div>

                {/* Quick Type Buttons - Always show popular ones */}
                <div className="flex flex-wrap gap-3">
                    {POKEMON_TYPES.slice(0, isExpanded ? POKEMON_TYPES.length : 8).map((pokemonType) => (
                        <button
                            key={pokemonType.name}
                            onClick={() => handleTypeSelect(pokemonType.name)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                type === pokemonType.name
                                    ? `${pokemonType.color} text-white shadow-lg scale-105`
                                    : `bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105`
                            }`}
                        >
                            {pokemonType.name}
                        </button>
                    ))}
                </div>

                {!isExpanded && POKEMON_TYPES.length > 8 && (
                    <div className="text-center">
                        <Button
                            variant="outline"
                            onClick={() => setIsExpanded(true)}
                            className="text-gray-600 hover:text-gray-800 border-dashed"
                        >
                            +{POKEMON_TYPES.length - 8} more types
                        </Button>
                    </div>
                )}
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                    {search && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Search: "{search}"
                            <button
                                onClick={() => setSearchValue('')}
                                className="hover:bg-gray-300 rounded-full p-0.5 ml-1"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    )}
                    {type && selectedTypeData && (
                        <Badge className={`${selectedTypeData.color} text-white flex items-center gap-1`}>
                            Type: {type}
                            <button
                                onClick={() => onTypeChange('')}
                                className="hover:bg-white/20 rounded-full p-0.5 ml-1"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
