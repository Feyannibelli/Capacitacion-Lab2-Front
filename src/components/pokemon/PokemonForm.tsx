import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { Plus, X, Save, Image } from 'lucide-react';
import { Pokemon, CreatePokemonData, UpdatePokemonData, PokemonType } from '@/types/pokemon';
import { useAbilities } from '@/hooks/usePokemon';

interface PokemonFormProps {
    pokemon?: Pokemon;
    onSubmit: (data: CreatePokemonData | UpdatePokemonData) => void;
    isLoading?: boolean;
}

const pokemonTypes = Object.values(PokemonType);

export function PokemonForm({ pokemon, onSubmit, isLoading = false }: PokemonFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        type: '' as PokemonType,
        height: 0,
        weight: 0,
        imageUrl: '',
        abilities: [] as string[],
    });

    const [newAbility, setNewAbility] = useState('');
    const { data: availableAbilities } = useAbilities();

    useEffect(() => {
        if (pokemon) {
            setFormData({
                name: pokemon.name,
                type: pokemon.type,
                height: pokemon.height,
                weight: pokemon.weight,
                imageUrl: pokemon.imageUrl || '',
                abilities: pokemon.abilities.map(pa => pa.ability.name),
            });
        }
    }, [pokemon]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (pokemon) {
            // Update existing pokemon
            onSubmit({
                id: pokemon.id,
                ...formData,
            });
        } else {
            // Create new pokemon
            onSubmit(formData);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addAbility = () => {
        if (newAbility.trim() && !formData.abilities.includes(newAbility.trim())) {
            setFormData(prev => ({
                ...prev,
                abilities: [...prev.abilities, newAbility.trim()]
            }));
            setNewAbility('');
        }
    };

    const removeAbility = (abilityToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            abilities: prev.abilities.filter(a => a !== abilityToRemove)
        }));
    };

    const addExistingAbility = (abilityName: string) => {
        if (!formData.abilities.includes(abilityName)) {
            setFormData(prev => ({
                ...prev,
                abilities: [...prev.abilities, abilityName]
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">#</span>
                        </div>
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter Pokémon name"
                                required
                                className="capitalize"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => handleInputChange('type', value as PokemonType)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pokemonTypes.map((type) => (
                                        <SelectItem key={type} value={type} className="capitalize">
                                            {type.toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="height">Height (m) *</Label>
                            <Input
                                id="height"
                                type="number"
                                step="0.1"
                                min="0"
                                value={formData.height}
                                onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                                placeholder="0.0"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg) *</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                min="0"
                                value={formData.weight}
                                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                                placeholder="0.0"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="imageUrl"
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                                    placeholder="https://example.com/pokemon.png"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        {formData.imageUrl && (
                            <div className="mt-3">
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">⚡</span>
                        </div>
                        Abilities
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Existing Abilities */}
                    {availableAbilities && availableAbilities.length > 0 && (
                        <div className="space-y-3">
                            <Label>Available Abilities</Label>
                            <div className="flex flex-wrap gap-2">
                                {availableAbilities.map((ability) => (
                                    <Button
                                        key={ability.id}
                                        type="button"
                                        variant={formData.abilities.includes(ability.name) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => addExistingAbility(ability.name)}
                                        className="text-xs"
                                    >
                                        {ability.name}
                                        {formData.abilities.includes(ability.name) && (
                                            <X className="w-3 h-3 ml-1" />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add New Ability */}
                    <div className="space-y-3">
                        <Label>Add New Ability</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newAbility}
                                onChange={(e) => setNewAbility(e.target.value)}
                                placeholder="Enter ability name"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addAbility();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                onClick={addAbility}
                                disabled={!newAbility.trim()}
                                size="sm"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Selected Abilities */}
                    <div className="space-y-3">
                        <Label>Selected Abilities ({formData.abilities.length})</Label>
                        <div className="flex flex-wrap gap-2">
                            {formData.abilities.map((ability) => (
                                <Badge
                                    key={ability}
                                    variant="secondary"
                                    className="flex items-center gap-2 px-3 py-1"
                                >
                                    {ability}
                                    <button
                                        type="button"
                                        onClick={() => removeAbility(ability)}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        {formData.abilities.length === 0 && (
                            <p className="text-sm text-gray-500">No abilities selected</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4 pt-6">
                <Button
                    type="submit"
                    disabled={isLoading || !formData.name || !formData.type}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                    {isLoading ? (
                        <LoadingSpinner size="sm" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isLoading ? 'Saving...' : pokemon ? 'Update Pokémon' : 'Create Pokémon'}
                </Button>
            </div>
        </form>
    );
}