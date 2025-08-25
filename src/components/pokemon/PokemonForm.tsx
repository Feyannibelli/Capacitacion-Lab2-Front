import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { X, Plus, AlertCircle } from 'lucide-react';
import { Pokemon, PokemonType } from '@/types/pokemon';
import { useAbilities } from '@/hooks/usePokemon';

interface PokemonFormProps {
    initialData?: Pokemon;
    onSubmit: (data: Partial<Pokemon>) => void;
    onCancel: () => void;
    isLoading: boolean;
    submitLabel: string;
    error?: Error | null;
}

const pokemonTypes = Object.values(PokemonType);

export function PokemonForm({
                                initialData,
                                onSubmit,
                                onCancel,
                                isLoading,
                                submitLabel,
                                error,
                            }: PokemonFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        type: initialData?.type || '',
        height: initialData?.height?.toString() || '',
        weight: initialData?.weight?.toString() || '',
        imageUrl: initialData?.imageUrl || '',
        abilities: initialData?.abilities?.map(pa => pa.ability.name) || [],
    });

    const [newAbility, setNewAbility] = useState('');
    const { data: availableAbilities } = useAbilities();
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                type: initialData.type,
                height: initialData.height.toString(),
                weight: initialData.weight.toString(),
                imageUrl: initialData.imageUrl || '',
                abilities: initialData.abilities?.map(pa => pa.ability.name) || [],
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length > 50) {
            newErrors.name = 'Name must be 50 characters or less';
        }

        if (!formData.type) {
            newErrors.type = 'Type is required';
        }

        const height = parseFloat(formData.height);
        if (!formData.height || isNaN(height) || height < 0) {
            newErrors.height = 'Height must be a positive number';
        }

        const weight = parseFloat(formData.weight);
        if (!formData.weight || isNaN(weight) || weight < 0) {
            newErrors.weight = 'Weight must be a positive number';
        }

        if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
            newErrors.imageUrl = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Transform form data to match Pokemon interface
        const pokemonData: Partial<Pokemon> = {
            name: formData.name.trim(),
            type: formData.type as PokemonType,
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight),
            imageUrl: formData.imageUrl.trim() || undefined,
            abilities: formData.abilities.map(name => ({
                ability: { id: 0, name: name.trim() }
            })),
        };

        onSubmit(pokemonData);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const addAbility = () => {
        const abilityName = newAbility.trim();
        if (abilityName && !formData.abilities.includes(abilityName)) {
            setFormData(prev => ({
                ...prev,
                abilities: [...prev.abilities, abilityName]
            }));
            setNewAbility('');
        }
    };

    const removeAbility = (abilityToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            abilities: prev.abilities.filter(ability => ability !== abilityToRemove)
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
            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error.message || 'An error occurred while saving the Pokémon'}
                    </AlertDescription>
                </Alert>
            )}

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Enter Pokémon name"
                                maxLength={50}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type">
                                Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value: string) => handleChange('type', value)}
                            >
                                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pokemonTypes.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {type.toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-red-500">{errors.type}</p>
                            )}
                        </div>

                        {/* Height */}
                        <div className="space-y-2">
                            <Label htmlFor="height">
                                Height (m) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="height"
                                type="number"
                                step="0.1"
                                min="0"
                                value={formData.height}
                                onChange={(e) => handleChange('height', e.target.value)}
                                placeholder="0.0"
                                className={errors.height ? 'border-red-500' : ''}
                            />
                            {errors.height && (
                                <p className="text-sm text-red-500">{errors.height}</p>
                            )}
                        </div>

                        {/* Weight */}
                        <div className="space-y-2">
                            <Label htmlFor="weight">
                                Weight (kg) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                min="0"
                                value={formData.weight}
                                onChange={(e) => handleChange('weight', e.target.value)}
                                placeholder="0.0"
                                className={errors.weight ? 'border-red-500' : ''}
                            />
                            {errors.weight && (
                                <p className="text-sm text-red-500">{errors.weight}</p>
                            )}
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL (optional)</Label>
                        <Input
                            id="imageUrl"
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => handleChange('imageUrl', e.target.value)}
                            placeholder="https://example.com/pokemon-image.jpg"
                            className={errors.imageUrl ? 'border-red-500' : ''}
                        />
                        {errors.imageUrl && (
                            <p className="text-sm text-red-500">{errors.imageUrl}</p>
                        )}
                        {formData.imageUrl && !errors.imageUrl && (
                            <div className="mt-2">
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                        setErrors(prev => ({
                                            ...prev,
                                            imageUrl: 'Could not load image from this URL'
                                        }));
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Abilities */}
            <Card>
                <CardHeader>
                    <CardTitle>Abilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Current Abilities */}
                    {formData.abilities.length > 0 && (
                        <div>
                            <Label>Current Abilities</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.abilities.map((ability, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="flex items-center gap-2"
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
                        </div>
                    )}

                    {/* Add New Ability */}
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={newAbility}
                                onChange={(e) => setNewAbility(e.target.value)}
                                placeholder="Enter ability name"
                                className="flex-1"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addAbility();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addAbility}
                                disabled={!newAbility.trim()}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                            </Button>
                        </div>

                        {/* Existing Abilities */}
                        {availableAbilities && availableAbilities.length > 0 && (
                            <div>
                                <Label className="text-sm text-gray-600">
                                    Or select from existing abilities:
                                </Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {availableAbilities
                                        .filter(ability => !formData.abilities.includes(ability.name))
                                        .map(ability => (
                                            <Button
                                                key={ability.id}
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addExistingAbility(ability.name)}
                                                className="text-xs"
                                            >
                                                {ability.name}
                                            </Button>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="sm:order-1"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="sm:order-2"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Saving...
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </div>
        </form>
    );
}