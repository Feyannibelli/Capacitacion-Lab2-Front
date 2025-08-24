import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePokemon, useDeletePokemon } from '@/hooks/usePokemon';
import { LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChevronLeft, Edit, Trash2, Weight, Ruler, Zap, Swords, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { mockPokemon } from '@/lib/api';

const typeColors: Record<string, string> = {
    Fire: 'bg-red-500',
    Water: 'bg-blue-500',
    Grass: 'bg-green-500',
    Electric: 'bg-yellow-500',
    Psychic: 'bg-purple-500',
    Ice: 'bg-cyan-400',
    Dragon: 'bg-indigo-600',
    Dark: 'bg-gray-700',
    Fairy: 'bg-pink-400',
    Fighting: 'bg-red-700',
    Poison: 'bg-purple-600',
    Ground: 'bg-yellow-600',
    Flying: 'bg-indigo-400',
    Bug: 'bg-green-600',
    Rock: 'bg-yellow-800',
    Ghost: 'bg-purple-800',
    Steel: 'bg-gray-500',
    Normal: 'bg-gray-400',
};

export function PokemonDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const pokemonId = parseInt(id!, 10);

    const { data: pokemon, isLoading, error } = usePokemon(pokemonId);
    const deleteMutation = useDeletePokemon();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Fallback to mock data for development
    const pokemonData = pokemon || mockPokemon.find(p => p.id === pokemonId);

    const handleDelete = async () => {
        deleteMutation.mutate(pokemonId, {
            onSuccess: () => {
                navigate('/', { replace: true });
            },
        });
        setDeleteDialogOpen(false);
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    if (error && !pokemonData) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>

                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load Pokémon data. {error instanceof Error && error.message}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!pokemonData) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>

                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pokémon not found</h2>
                    <p className="text-gray-600 mb-4">The Pokémon you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate('/')}>Back to Home</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold capitalize">{pokemonData.name}</h1>
                        <div className="flex gap-2 mt-2">
                            {pokemonData.type.map((type) => (
                                <Badge
                                    key={type}
                                    className={`text-white ${typeColors[type] || 'bg-gray-500'}`}
                                >
                                    {type}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button asChild size="sm">
                        <Link to={`/pokemon/${pokemonData.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Link>
                    </Button>

                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Pokémon</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete {pokemonData.name}? This action cannot be undone.
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
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image and Basic Stats */}
                <Card>
                    <CardContent className="p-6">
                        <div className="aspect-square bg-gray-50 rounded-lg mb-6 overflow-hidden">
                            <img
                                src={pokemonData.imageUrl}
                                alt={pokemonData.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Ruler className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Height</p>
                                    <p className="font-semibold">{pokemonData.height}m</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Weight className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Weight</p>
                                    <p className="font-semibold">{pokemonData.weight}kg</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Abilities and Moves */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                Abilities
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {pokemonData.abilities.map((ability) => (
                                    <Badge key={ability} variant="secondary" className="text-sm">
                                        {ability}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Swords className="w-5 h-5" />
                                Moves
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {pokemonData.moves.map((move) => (
                                    <Badge key={move} variant="outline" className="justify-start text-sm">
                                        {move}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {pokemonData.createdAt && (
                <Card>
                    <CardContent className="p-4">
                        <div className="text-sm text-gray-500 text-center">
                            Created: {new Date(pokemonData.createdAt).toLocaleDateString()}
                            {pokemonData.updatedAt && pokemonData.updatedAt !== pokemonData.createdAt && (
                                <span className="ml-4">
                  Updated: {new Date(pokemonData.updatedAt).toLocaleDateString()}
                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}