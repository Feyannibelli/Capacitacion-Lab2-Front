import { useNavigate } from 'react-router-dom';
import { PokemonForm } from '@/components/pokemon/PokemonForm';
import { useCreatePokemon } from '@/hooks/usePokemon';
import { CreatePokemonData } from '@/types/pokemon';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CreatePokemonPage() {
    const navigate = useNavigate();
    const createMutation = useCreatePokemon();

    const handleSubmit = (data: CreatePokemonData) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                navigate('/', { replace: true });
            },
        });
    };

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
                    <h1 className="text-3xl font-bold">Create New Pokémon</h1>
                    <p className="text-gray-600 mt-1">Add a new Pokémon to your collection</p>
                </div>
            </div>

            <PokemonForm
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending}
            />
        </div>
    );
}