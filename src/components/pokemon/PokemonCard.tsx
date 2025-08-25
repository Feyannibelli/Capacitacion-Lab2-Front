import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pokemon, PokemonType } from '@/types/pokemon';
import { Eye, Edit, Ruler, Weight } from 'lucide-react';

interface PokemonCardProps {
    pokemon: Pokemon;
    onView?: (pokemon: Pokemon) => void;
    onEdit?: (pokemon: Pokemon) => void;
}

const typeColors: Record<PokemonType, string> = {
    [PokemonType.NORMAL]: 'bg-gray-400',
    [PokemonType.FIRE]: 'bg-red-500',
    [PokemonType.WATER]: 'bg-blue-500',
    [PokemonType.GRASS]: 'bg-green-500',
    [PokemonType.ELECTRIC]: 'bg-yellow-500',
    [PokemonType.ICE]: 'bg-cyan-400',
    [PokemonType.FIGHTING]: 'bg-red-700',
    [PokemonType.POISON]: 'bg-purple-600',
    [PokemonType.GROUND]: 'bg-yellow-600',
    [PokemonType.FLYING]: 'bg-indigo-400',
    [PokemonType.PSYCHIC]: 'bg-purple-500',
    [PokemonType.BUG]: 'bg-green-600',
    [PokemonType.ROCK]: 'bg-yellow-800',
    [PokemonType.GHOST]: 'bg-purple-800',
    [PokemonType.DRAGON]: 'bg-indigo-600',
    [PokemonType.DARK]: 'bg-gray-700',
    [PokemonType.STEEL]: 'bg-gray-500',
    [PokemonType.FAIRY]: 'bg-pink-400',
};

export function PokemonCard({ pokemon, onView, onEdit }: PokemonCardProps) {
    const typeColor = typeColors[pokemon.type] || typeColors[PokemonType.NORMAL];

    return (
        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden">
            <div className={`h-2 ${typeColor}`} />

            <CardContent className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold capitalize text-gray-800 group-hover:text-blue-600 transition-colors">
                                {pokemon.name}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-500">
                            #{pokemon.id.toString().padStart(3, '0')}
                        </p>
                    </div>

                    <Badge className={`${typeColor} text-white font-medium`}>
                        {pokemon.type.toLowerCase()}
                    </Badge>
                </div>

                {/* Image */}
                <div className="relative">
                    <div className="w-full h-48 bg-gray-50 rounded-xl overflow-hidden group-hover:bg-gray-100 transition-colors">
                        {pokemon.imageUrl ? (
                            <img
                                src={pokemon.imageUrl}
                                alt={pokemon.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x200/f3f4f6/9ca3af?text=${pokemon.name.charAt(0).toUpperCase()}`;
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-6xl font-bold text-gray-300">
                                    {pokemon.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Ruler className="w-4 h-4" />
                        <span>{pokemon.height}m</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Weight className="w-4 h-4" />
                        <span>{pokemon.weight}kg</span>
                    </div>
                </div>

                {/* Abilities */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Abilities:</p>
                    <div className="flex flex-wrap gap-1">
                        {pokemon.abilities.slice(0, 3).map((pokemonAbility) => (
                            <Badge
                                key={pokemonAbility.ability.id}
                                variant="secondary"
                                className="text-xs px-2 py-1"
                            >
                                {pokemonAbility.ability.name}
                            </Badge>
                        ))}
                        {pokemon.abilities.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-1">
                                +{pokemon.abilities.length - 3} more
                            </Badge>
                        )}
                        {pokemon.abilities.length === 0 && (
                            <span className="text-xs text-gray-400">No abilities</span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView?.(pokemon)}
                        className="flex-1 group-hover:border-blue-300"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(pokemon)}
                        className="flex-1 group-hover:border-green-300"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}