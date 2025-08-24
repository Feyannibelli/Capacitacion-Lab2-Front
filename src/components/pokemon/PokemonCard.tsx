import { Pokemon } from '@/types/pokemon';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit, Eye, Trash2, Weight, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDeletePokemon } from '@/hooks/usePokemon';

interface PokemonCardProps {
    pokemon: Pokemon;
}

const typeColors: Record<string, string> = {
    Fire: 'bg-red-500 hover:bg-red-600',
    Water: 'bg-blue-500 hover:bg-blue-600',
    Grass: 'bg-green-500 hover:bg-green-600',
    Electric: 'bg-yellow-500 hover:bg-yellow-600',
    Psychic: 'bg-purple-500 hover:bg-purple-600',
    Ice: 'bg-cyan-400 hover:bg-cyan-500',
    Dragon: 'bg-indigo-600 hover:bg-indigo-700',
    Dark: 'bg-gray-700 hover:bg-gray-800',
    Fairy: 'bg-pink-400 hover:bg-pink-500',
    Fighting: 'bg-red-700 hover:bg-red-800',
    Poison: 'bg-purple-600 hover:bg-purple-700',
    Ground: 'bg-yellow-600 hover:bg-yellow-700',
    Flying: 'bg-indigo-400 hover:bg-indigo-500',
    Bug: 'bg-green-600 hover:bg-green-700',
    Rock: 'bg-yellow-800 hover:bg-yellow-900',
    Ghost: 'bg-purple-800 hover:bg-purple-900',
    Steel: 'bg-gray-500 hover:bg-gray-600',
    Normal: 'bg-gray-400 hover:bg-gray-500',
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const deleteMutation = useDeletePokemon();

    const handleDelete = async () => {
        deleteMutation.mutate(pokemon.id);
        setDeleteDialogOpen(false);
    };

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold capitalize">{pokemon.name}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                <div className="flex flex-wrap gap-1">
                    {pokemon.type.map((type) => (
                        <Badge
                            key={type}
                            className={`text-white ${typeColors[type] || 'bg-gray-500'}`}
                        >
                            {type}
                        </Badge>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                <div className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden">
                    <img
                        src={pokemon.imageUrl}
                        alt={pokemon.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Ruler className="w-4 h-4" />
                        <span>{pokemon.height}m</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Weight className="w-4 h-4" />
                        <span>{pokemon.weight}kg</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-3">
                <div className="w-full">
                    <div className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Abilities:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {pokemon.abilities.slice(0, 2).map((ability) => (
                                <Badge key={ability} variant="outline" className="text-xs">
                                    {ability}
                                </Badge>
                            ))}
                            {pokemon.abilities.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{pokemon.abilities.length - 2} more
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardFooter>

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