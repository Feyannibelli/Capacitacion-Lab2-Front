import { Pokemon } from '@/types/pokemon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDeletePokemon } from '@/hooks/usePokemon';

interface PokemonCardProps {
    pokemon: Pokemon;
}

const typeColors: Record<string, string> = {
    Fire: '#FF6B6B',
    Water: '#4ECDC4',
    Grass: '#95E1D3',
    Electric: '#F9CA24',
    Psychic: '#A55EEA',
    Ice: '#74B9FF',
    Dragon: '#6C5CE7',
    Dark: '#636E72',
    Fairy: '#FD79A8',
    Fighting: '#E17055',
    Poison: '#A29BFE',
    Ground: '#FDCB6E',
    Flying: '#81ECEC',
    Bug: '#00B894',
    Rock: '#E84393',
    Ghost: '#A55EEA',
    Steel: '#74B9FF',
    Normal: '#DDD',
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const deleteMutation = useDeletePokemon();

    const handleDelete = async () => {
        deleteMutation.mutate(pokemon.id);
        setDeleteDialogOpen(false);
    };

    const primaryType = pokemon.type[0];
    const cardColor = typeColors[primaryType] || typeColors.Normal;

    return (
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white rounded-3xl">
            {/* Header with colored background */}
            <div
                className="px-6 py-4 text-white relative"
                style={{ backgroundColor: cardColor }}
            >
                {/* Pokemon number and menu */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold opacity-90">
                        #{pokemon.id.toString().padStart(3, '0')}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 h-8 w-8 opacity-80 hover:opacity-100"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link to={`/pokemon/${pokemon.id}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={`/pokemon/${pokemon.id}/edit`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Pokemon name */}
                <h3 className="text-2xl font-bold capitalize mb-3 leading-tight">
                    {pokemon.name}
                </h3>

                {/* Type badges */}
                <div className="flex gap-2 mb-4">
                    {pokemon.type.map((type) => (
                        <Badge
                            key={type}
                            className="bg-white/25 text-white border-0 hover:bg-white/35 font-medium px-3 py-1 text-xs rounded-full"
                        >
                            {type}
                        </Badge>
                    ))}
                </div>

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
            </div>

            {/* White content area */}
            <CardContent className="p-6 bg-white">
                {/* Pokemon image */}
                <div className="relative mb-6 -mt-12 z-10">
                    <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-lg overflow-hidden border-4 border-white">
                        <img
                            src={pokemon.imageUrl}
                            alt={pokemon.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Pokemon stats */}
                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">Height</span>
                        <span className="font-bold text-gray-800">{pokemon.height}m</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">Weight</span>
                        <span className="font-bold text-gray-800">{pokemon.weight}kg</span>
                    </div>
                </div>

                {/* Abilities */}
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">Abilities</h4>
                    <div className="flex flex-wrap gap-1">
                        {pokemon.abilities.slice(0, 3).map((ability) => (
                            <Badge
                                key={ability}
                                variant="outline"
                                className="text-xs px-2 py-0.5 border-gray-300 text-gray-700"
                            >
                                {ability}
                            </Badge>
                        ))}
                        {pokemon.abilities.length > 3 && (
                            <Badge
                                variant="outline"
                                className="text-xs px-2 py-0.5 border-gray-300 text-gray-700"
                            >
                                +{pokemon.abilities.length - 3}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Action button */}
                <Link to={`/pokemon/${pokemon.id}`}>
                    <Button
                        className="w-full rounded-xl font-medium"
                        style={{ backgroundColor: cardColor }}
                    >
                        View Details
                    </Button>
                </Link>
            </CardContent>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Pokémon</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {pokemon.name}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}