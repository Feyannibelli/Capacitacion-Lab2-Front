import { Pokemon, PokemonType } from '@/types/pokemon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Weight, Ruler } from 'lucide-react';

interface PokemonCardProps {
    pokemon: Pokemon;
    onView: (pokemon: Pokemon) => void;
    onEdit: (pokemon: Pokemon) => void;
}

const typeColors: Record<PokemonType, string> = {
    [PokemonType.FIRE]: 'bg-red-500',
    [PokemonType.WATER]: 'bg-blue-500',
    [PokemonType.GRASS]: 'bg-green-500',
    [PokemonType.ELECTRIC]: 'bg-yellow-500',
    [PokemonType.PSYCHIC]: 'bg-purple-500',
    [PokemonType.ICE]: 'bg-cyan-400',
    [PokemonType.DRAGON]: 'bg-indigo-600',
    [PokemonType.DARK]: 'bg-gray-700',
    [PokemonType.FAIRY]: 'bg-pink-400',
    [PokemonType.FIGHTING]: 'bg-red-700',
    [PokemonType.POISON]: 'bg-purple-600',
    [PokemonType.GROUND]: 'bg-yellow-600',
    [PokemonType.FLYING]: 'bg-indigo-400',
    [PokemonType.BUG]: 'bg-green-600',
    [PokemonType.ROCK]: 'bg-yellow-800',
    [PokemonType.GHOST]: 'bg-purple-800',
    [PokemonType.STEEL]: 'bg-gray-500',
    [PokemonType.NORMAL]: 'bg-gray-400',
};

export function PokemonCard({ pokemon, onView, onEdit }: PokemonCardProps) {
    const typeColor = typeColors[pokemon.type] || typeColors[PokemonType.NORMAL];

    return (
        <Card 
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer"
            onClick={() => onView(pokemon)}
        >
            <CardContent className="p-0">
                {/* Image Section */}
                <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="aspect-square p-6 flex items-center justify-center">
                        {pokemon.imageUrl ? (
                            <img
                                src={pokemon.imageUrl}
                                alt={pokemon.name}
                                className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x200/f3f4f6/9ca3af?text=${pokemon.name.charAt(0).toUpperCase()}`;
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-6xl font-bold text-gray-400">
                                    {pokemon.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Pokemon Number */}
                    <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-sm font-bold text-white">
                            #{pokemon.id.toString().padStart(3, '0')}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    {/* Name and Type */}
                    <div className="mb-4">
                        <h3 className="text-xl font-bold capitalize text-gray-900 mb-2">
                            {pokemon.name}
                        </h3>
                        <Badge className={`${typeColor} text-white border-none capitalize`}>
                            {pokemon.type.toLowerCase()}
                        </Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Ruler className="w-4 h-4" />
                            <span>{pokemon.height}m</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Weight className="w-4 h-4" />
                            <span>{pokemon.weight}kg</span>
                        </div>
                    </div>

                    {/* Abilities */}
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Abilities:</p>
                        <div className="flex flex-wrap gap-1">
                            {pokemon.abilities && pokemon.abilities.length > 0 ? (
                                pokemon.abilities.slice(0, 3).map((pokemonAbility, index) => (
                                    <span
                                        key={pokemonAbility.ability.id}
                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize"
                                    >
                                        {pokemonAbility.ability.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400">No abilities</span>
                            )}
                            {pokemon.abilities && pokemon.abilities.length > 3 && (
                                <span className="text-xs text-gray-400">
                                    +{pokemon.abilities.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(pokemon);
                            }}
                            className="w-full"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}