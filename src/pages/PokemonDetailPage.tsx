import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePokemon, useDeletePokemon } from '@/hooks/usePokemon';
import { LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChevronLeft, Edit, Trash2, Weight, Ruler, Zap, AlertCircle, Star, Heart } from 'lucide-react';
import { Pokemon, PokemonType } from '@/types/pokemon';

const typeColors: Record<PokemonType, { bg: string; gradient: string; light: string }> = {
    [PokemonType.FIRE]: { bg: 'bg-red-500', gradient: 'from-red-400 to-red-600', light: 'bg-red-50' },
    [PokemonType.WATER]: { bg: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600', light: 'bg-blue-50' },
    [PokemonType.GRASS]: { bg: 'bg-green-500', gradient: 'from-green-400 to-green-600', light: 'bg-green-50' },
    [PokemonType.ELECTRIC]: { bg: 'bg-yellow-500', gradient: 'from-yellow-400 to-yellow-600', light: 'bg-yellow-50' },
    [PokemonType.PSYCHIC]: { bg: 'bg-purple-500', gradient: 'from-purple-400 to-purple-600', light: 'bg-purple-50' },
    [PokemonType.ICE]: { bg: 'bg-cyan-400', gradient: 'from-cyan-300 to-cyan-500', light: 'bg-cyan-50' },
    [PokemonType.DRAGON]: { bg: 'bg-indigo-600', gradient: 'from-indigo-500 to-indigo-700', light: 'bg-indigo-50' },
    [PokemonType.DARK]: { bg: 'bg-gray-700', gradient: 'from-gray-600 to-gray-800', light: 'bg-gray-50' },
    [PokemonType.FAIRY]: { bg: 'bg-pink-400', gradient: 'from-pink-300 to-pink-500', light: 'bg-pink-50' },
    [PokemonType.FIGHTING]: { bg: 'bg-red-700', gradient: 'from-red-600 to-red-800', light: 'bg-red-50' },
    [PokemonType.POISON]: { bg: 'bg-purple-600', gradient: 'from-purple-500 to-purple-700', light: 'bg-purple-50' },
    [PokemonType.GROUND]: { bg: 'bg-yellow-600', gradient: 'from-yellow-500 to-yellow-700', light: 'bg-yellow-50' },
    [PokemonType.FLYING]: { bg: 'bg-indigo-400', gradient: 'from-indigo-300 to-indigo-500', light: 'bg-indigo-50' },
    [PokemonType.BUG]: { bg: 'bg-green-600', gradient: 'from-green-500 to-green-700', light: 'bg-green-50' },
    [PokemonType.ROCK]: { bg: 'bg-yellow-800', gradient: 'from-yellow-700 to-yellow-900', light: 'bg-yellow-50' },
    [PokemonType.GHOST]: { bg: 'bg-purple-800', gradient: 'from-purple-700 to-purple-900', light: 'bg-purple-50' },
    [PokemonType.STEEL]: { bg: 'bg-gray-500', gradient: 'from-gray-400 to-gray-600', light: 'bg-gray-50' },
    [PokemonType.NORMAL]: { bg: 'bg-gray-400', gradient: 'from-gray-300 to-gray-500', light: 'bg-gray-50' },
};

export function PokemonDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const pokemonId = parseInt(id!, 10);

    const { data: pokemon, isLoading, error } = usePokemon(pokemonId);
    const deleteMutation = useDeletePokemon();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        deleteMutation.mutate(pokemonId, {
            onSuccess: () => {
                navigate('/', { replace: true });
            },
        });
        setDeleteDialogOpen(false);
    };

    const handleEdit = () => {
        navigate(`/pokemon/${pokemonId}/edit`);
    };

    const handleBack = () => {
        navigate('/', { replace: false });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Loading Pokémon details...</p>
                </div>
            </div>
        );
    }

    if (error || !pokemon) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBack}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back to Pokédex
                            </Button>
                        </div>

                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {error ? `Failed to load Pokémon data. ${error instanceof Error && error.message}` : 'Pokémon not found.'}
                            </AlertDescription>
                        </Alert>

                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pokémon not found</h2>
                            <p className="text-gray-600 mb-4">The Pokémon you're looking for doesn't exist.</p>
                            <Button onClick={handleBack}>Back to Pokédex</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const typeConfig = typeColors[pokemon.type] || typeColors[PokemonType.NORMAL];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Navigation */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Pokédex
                    </Button>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Hero Section */}
                    <div className={`relative bg-gradient-to-br ${typeConfig.gradient} px-8 py-12`}>
                        {/* Background decorations */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

                        <div className="relative flex flex-col lg:flex-row items-center gap-8">
                            {/* Pokemon Image */}
                            <div className="relative">
                                <div className="w-80 h-80 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 overflow-hidden shadow-2xl">
                                    {pokemon.imageUrl ? (
                                        <img
                                            src={pokemon.imageUrl}
                                            alt={pokemon.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://via.placeholder.com/320x320/f3f4f6/9ca3af?text=${pokemon.name.charAt(0).toUpperCase()}`;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-9xl font-bold text-white/50">
                                                {pokemon.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -top-4 -right-4 flex gap-2">
                                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                                        <Star className="w-6 h-6 text-yellow-800" fill="currentColor" />
                                    </div>
                                    <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center shadow-lg">
                                        <Heart className="w-6 h-6 text-red-800" fill="currentColor" />
                                    </div>
                                </div>
                            </div>

                            {/* Pokemon Info */}
                            <div className="flex-1 text-white text-center lg:text-left">
                                <div className="mb-4">
                                    <span className="text-2xl font-bold opacity-80">
                                        #{pokemon.id.toString().padStart(3, '0')}
                                    </span>
                                </div>

                                <h1 className="text-6xl font-bold capitalize mb-6 leading-tight">
                                    {pokemon.name}
                                </h1>

                                <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                                    <Badge
                                        className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-medium text-lg px-4 py-2"
                                    >
                                        {pokemon.type.toLowerCase()}
                                    </Badge>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                                    <div className="flex items-center justify-center lg:justify-start gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <Ruler className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-white/80 text-sm">Height</p>
                                            <p className="text-2xl font-bold">{pokemon.height}m</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <Weight className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-white/80 text-sm">Weight</p>
                                            <p className="text-2xl font-bold">{pokemon.weight}kg</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-4 justify-center lg:justify-start">
                                    <Button
                                        onClick={handleEdit}
                                        size="lg"
                                        className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                                    >
                                        <Edit className="w-5 h-5 mr-2" />
                                        Edit Pokémon
                                    </Button>

                                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="border-white/30 text-white hover:bg-red-600 hover:text-white hover:border-red-600 font-semibold"
                                            >
                                                <Trash2 className="w-5 h-5 mr-2" />
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
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
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Abilities Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${typeConfig.bg} rounded-lg flex items-center justify-center`}>
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        Abilities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {pokemon.abilities && pokemon.abilities.length > 0 ? (
                                        <div className="space-y-3">
                                            {pokemon.abilities.map((pokemonAbility) => (
                                                <div
                                                    key={pokemonAbility.ability.id}
                                                    className={`${typeConfig.light} rounded-xl p-4 border border-gray-100`}
                                                >
                                                    <h4 className="font-semibold text-gray-900 capitalize mb-1">
                                                        {pokemonAbility.ability.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        This Pokémon has the {pokemonAbility.ability.name.toLowerCase()} ability.
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No abilities available</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Stats Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Base Stats</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">ID</span>
                                            <span className="text-xl font-bold">#{pokemon.id.toString().padStart(3, '0')}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">Type</span>
                                            <Badge className={`${typeConfig.bg} text-white`}>
                                                {pokemon.type.toLowerCase()}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">Height</span>
                                            <span className="text-xl font-bold">{pokemon.height}m</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">Weight</span>
                                            <span className="text-xl font-bold">{pokemon.weight}kg</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">Abilities</span>
                                            <span className="text-xl font-bold">{pokemon.abilities?.length || 0}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Additional Info */}
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Created</h4>
                                        <p className="text-gray-600">
                                            {pokemon.createdAt ? new Date(pokemon.createdAt).toLocaleDateString() : 'Unknown'}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Last Updated</h4>
                                        <p className="text-gray-600">
                                            {pokemon.updatedAt ? new Date(pokemon.updatedAt).toLocaleDateString() : 'Unknown'}
                                        </p>
                                    </div>
                                    {pokemon.imageUrl && (
                                        <div className="md:col-span-2">
                                            <h4 className="font-semibold text-gray-900 mb-2">Image URL</h4>
                                            <p className="text-gray-600 text-sm break-all">{pokemon.imageUrl}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}