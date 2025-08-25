import { useNavigate } from 'react-router-dom';
import { useCreatePokemon } from '@/hooks/usePokemon';
import { PokemonForm } from '@/components/pokemon/PokemonForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';

export function PokemonCreatePage() {
    const navigate = useNavigate();
    const createMutation = useCreatePokemon();

    const handleSubmit = async (data: Partial<Pokemon>) => {
        createMutation.mutate(data, {
            onSuccess: (newPokemon) => {
                navigate(`/pokemon/${newPokemon.id}`, { replace: true });
            },
        });
    };

    const handleCancel = () => {
        navigate('/', { replace: false });
    };

    const handleBack = () => {
        navigate('/', { replace: false });
    };

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
                        Back to Pokédex
                    </Button>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                <Plus className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Create New Pokémon</h1>
                                <p className="text-green-100 mt-1">
                                    Add a new Pokémon to your Pokédex
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <PokemonForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={createMutation.isPending}
                            submitLabel="Create Pokémon"
                            error={createMutation.error}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}