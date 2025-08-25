import { useNavigate, useParams } from 'react-router-dom';
import { usePokemon, useUpdatePokemon } from '@/hooks/usePokemon';
import { PokemonForm } from '@/components/pokemon/PokemonForm';
import { LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';

export function PokemonEditPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const pokemonId = parseInt(id!, 10);

    const { data: pokemon, isLoading, error } = usePokemon(pokemonId);
    const updateMutation = useUpdatePokemon();

    const handleSubmit = async (data: Partial<Pokemon>) => {
        updateMutation.mutate(
            { id: pokemonId, data },
            {
                onSuccess: (updatedPokemon) => {
                    navigate(`/pokemon/${updatedPokemon.id}`, { replace: true });
                },
            }
        );
    };

    const handleCancel = () => {
        navigate(`/pokemon/${pokemonId}`, { replace: false });
    };

    const handleBack = () => {
        navigate(`/pokemon/${pokemonId}`, { replace: false });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Loading Pokémon data...</p>
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
                                Back
                            </Button>
                        </div>

                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {error ? `Failed to load Pokémon data. ${error instanceof Error && error.message}` : 'Pokémon not found.'}
                            </AlertDescription>
                        </Alert>

                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cannot edit Pokémon</h2>
                            <p className="text-gray-600 mb-4">The Pokémon you're trying to edit doesn't exist or couldn't be loaded.</p>
                            <Button onClick={() => navigate('/')}>Back to Pokédex</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Navigation */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to {pokemon.name}
                    </Button>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-xl overflow-hidden backdrop-blur-sm border border-white/30">
                                {pokemon.imageUrl ? (
                                    <img
                                        src={pokemon.imageUrl}
                                        alt={pokemon.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=${pokemon.name.charAt(0)}`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white/80">
                                            {pokemon.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Edit Pokémon</h1>
                                <p className="text-blue-100 mt-1">
                                    Editing {pokemon.name} #{pokemon.id.toString().padStart(3, '0')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <PokemonForm
                            initialData={pokemon}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={updateMutation.isPending}
                            submitLabel="Update Pokémon"
                            error={updateMutation.error}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}