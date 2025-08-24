import { useNavigate, useParams } from 'react-router-dom';
import { PokemonForm } from '@/components/pokemon/PokemonForm';
import { usePokemon, useUpdatePokemon } from '@/hooks/usePokemon';
import { UpdatePokemonData } from '@/types/pokemon';
import { LoadingSpinner } from '@/components/ui/loading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockPokemon } from '@/lib/api';

export function EditPokemonPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const pokemonId = parseInt(id!, 10);

    const { data: pokemon, isLoading, error } = usePokemon(pokemonId);
    const updateMutation = useUpdatePokemon();

    // Fallback to mock data for development
    const pokemonData = pokemon || mockPokemon.find(p => p.id === pokemonId);

    const handleSubmit = (data: UpdatePokemonData) => {
        updateMutation.mutate(data, {
            onSuccess: () => {
                navigate(`/pokemon/${pokemonId}`, { replace: true });
            },
        });
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
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Edit {pokemonData.name}</h1>
                    <p className="text-gray-600 mt-1">Update Pokémon information</p>
                </div>
            </div>

            <PokemonForm
                pokemon={pokemonData}
                onSubmit={handleSubmit}
                isLoading={updateMutation.isPending}
            />
        </div>
    );
}