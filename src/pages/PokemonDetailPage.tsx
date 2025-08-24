import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePokemon, useDeletePokemon } from '@/hooks/usePokemon';
import { LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChevronLeft, Edit, Trash2, Weight, Ruler, Zap, Swords, AlertCircle, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { mockPokemon } from '@/lib/api';

const typeColors: Record<string, { bg: string; gradient: string; light: string }> = {
    Fire: { bg: 'bg-red-500', gradient: 'from-red-400 to-red-600', light: 'bg-red-50' },
    Water: { bg: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600', light: 'bg-blue-50' },
    Grass: { bg: 'bg-green-500', gradient: 'from-green-400 to-green-600', light: 'bg-green-50' },
    Electric: { bg: 'bg-yellow-500', gradient: 'from-yellow-400 to-yellow-600', light: 'bg-yellow-50' },
    Psychic: { bg: 'bg-purple-500', gradient: 'from-purple-400 to-purple-600', light: 'bg-purple-50' },
    Ice: { bg: 'bg-cyan-400', gradient: 'from-cyan-300 to-cyan-500', light: 'bg-cyan-50' },
    Dragon: { bg: 'bg-indigo-600', gradient: 'from-indigo-500 to-indigo-700', light: 'bg-indigo-50' },
    Dark: { bg: 'bg-gray-700', gradient: 'from-gray-600 to-gray-800', light: 'bg-gray-50' },
    Fairy: { bg: 'bg-pink-400', gradient: 'from-pink-300 to-pink-500', light: 'bg-pink-50' },
    Fighting: { bg: 'bg-red-700', gradient: 'from-red-600 to-red-800', light: 'bg-red-50' },
    Poison: { bg: 'bg-purple-600', gradient: 'from-purple-500 to-purple-700', light: 'bg-purple-50' },
    Ground: { bg: 'bg-yellow-600', gradient: 'from-yellow-500 to-yellow-700', light: 'bg-yellow-50' },
    Flying: { bg: 'bg-indigo-400', gradient: 'from-indigo-300 to-indigo-500', light: 'bg-indigo-50' },
    Bug: { bg: 'bg-green-600', gradient: 'from-green-500 to-green-700', light: 'bg-green-50' },
    Rock: { bg: 'bg-yellow-800', gradient: 'from-yellow-700 to-yellow-900', light: 'bg-yellow-50' },
    Ghost: { bg: 'bg-purple-800', gradient: 'from-purple-700 to-purple-900', light: 'bg-purple-50' },
    Steel: { bg: 'bg-gray-500', gradient: 'from-gray-400 to-gray-600', light: 'bg-gray-50' },
    Normal: { bg: 'bg-gray-400', gradient: 'from-gray-300 to-gray-500', light: 'bg-gray-50' },
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Loading Pokémon details...</p>
                </div>
            </div>
        );
    }

    if (error && !pokemonData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back to Pokédex
                            </Button>
                        </div>

                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Failed to load Pokémon data. {error instanceof Error && error.message}
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        );
    }

    if (!pokemonData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back to Pokédex
                            </Button>
                        </div>

                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pokémon not found</h2>
                            <p className="text-gray-600 mb-4">The Pokémon you're looking for doesn't exist.</p>
                            <Button onClick={() => navigate('/')}>Back to Pokédex</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const primaryType = pokemonData.type[0];
    const typeConfig = typeColors[primaryType] || typeColors.Normal;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Navigation */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/')}
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
                                    <img
                                        src={pokemonData.imageUrl}
                                        alt={pokemonData.name}
                                        className="w-full h-full object-cover"
                                    />
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
                                        #{pokemonData.id.toString().padStart(3, '0')}
                                    </span>
                                </div>

                                <h1 className="text-6xl font-bold capitalize mb-6 leading-tight">
                                    {pokemonData.name}
                                </h1>

                                <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                                    {pokemonData.type.map((type) => (
                                        <Badge
                                            key={type}
                                            className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-medium text-lg px-4 py-2"
                                        >
                                            {type}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Ruler className="w-5 h-5 opacity-80" />
                                            <span className="text-sm opacity-80 font-medium">Height</span>
                                        </div>
                                        <div className="text-2xl font-bold">{pokemonData.height}m</div>
                                    </div>
                                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Weight className="w-5 h-5 opacity-80" />
                                            <span className="text-sm opacity-80 font-medium">Weight</span>
                                        </div>
                                        <div className="text-2xl font-bold">{pokemonData.weight}kg</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 justify-center lg:justify-start mt-8">
                                    <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                                        <Link to={`/pokemon/${pokemonData.id}/edit`}>
                                            <Edit className="w-5 h-5 mr-2" />
                                            Edit Pokémon
                                        </Link>
                                    </Button>

                                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button size="lg" className="bg-red-500/80 hover:bg-red-600 text-white">
                                                <Trash2 className="w-5 h-5 mr-2" />
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
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Abilities */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader className={`${typeConfig.light} border-b`}>
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className={`p-2 ${typeConfig.bg} rounded-lg`}>
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        Abilities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid gap-3">
                                        {pokemonData.abilities.map((ability, index) => (
                                            <div key={ability} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <div className={`w-8 h-8 ${typeConfig.bg} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                                                    {index + 1}
                                                </div>
                                                <span className="font-medium text-gray-800">{ability}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Moves */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader className={`${typeConfig.light} border-b`}>
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className={`p-2 ${typeConfig.bg} rounded-lg`}>
                                            <Swords className="w-5 h-5 text-white" />
                                        </div>
                                        Moves
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {pokemonData.moves.map((move, index) => (
                                            <div key={move} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <div className={`w-6 h-6 ${typeConfig.bg} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                                                    {index + 1}
                                                </div>
                                                <span className="font-medium text-gray-800 text-sm">{move}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Metadata */}
                        {pokemonData.createdAt && (
                            <Card className="mt-8 border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-8">
                                            <div>
                                                <span className="font-medium">Created:</span>
                                                <span className="ml-2">{new Date(pokemonData.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {pokemonData.updatedAt && pokemonData.updatedAt !== pokemonData.createdAt && (
                                                <div>
                                                    <span className="font-medium">Updated:</span>
                                                    <span className="ml-2">{new Date(pokemonData.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}