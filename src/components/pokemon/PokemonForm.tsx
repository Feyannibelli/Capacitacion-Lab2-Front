import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Save, AlertCircle, Zap, Image as ImageIcon } from 'lucide-react';
import { Pokemon, PokemonType } from '@/types/pokemon';
import { useState, useEffect } from 'react';

const formSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(50, 'Name must be 50 characters or less')
        .regex(/^[a-zA-Z\s-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
    type: z.nativeEnum(PokemonType, { errorMap: () => ({ message: 'Please select a valid type' }) }),
    height: z
        .number({ invalid_type_error: 'Height must be a number' })
        .min(0, 'Height must be positive')
        .max(100, 'Height must be less than 100 meters'),
    weight: z
        .number({ invalid_type_error: 'Weight must be a number' })
        .min(0, 'Weight must be positive')
        .max(10000, 'Weight must be less than 10,000 kg'),
    imageUrl: z
        .string()
        .url('Must be a valid URL')
        .optional()
        .or(z.literal('')),
    abilities: z
        .array(z.string().min(1, 'Ability name cannot be empty'))
        .max(6, 'Maximum 6 abilities allowed'),
});

type FormData = z.infer<typeof formSchema>;

interface PokemonFormProps {
    initialData?: Pokemon;
    onSubmit: (data: Partial<Pokemon>) => void;
    onCancel: () => void;
    isLoading?: boolean;
    submitLabel?: string;
    error?: Error | null;
}

const pokemonTypes = Object.values(PokemonType);

const typeColors: Record<PokemonType, string> = {
    [PokemonType.FIRE]: 'bg-red-500',
    [PokemonType.WATER]: 'bg-blue-500',
    [PokemonType.GRASS]: 'bg-green-500',
    [PokemonType.ELECTRIC]: 'bg-yellow-500',
    [PokemonType.PSYCHIC]: 'bg-purple-500',
    [PokemonType.ICE]: 'bg-cyan-400',
    [PokemonType.DRAGON]: 'bg-indigo-600',
    [PokemonType.DARK]: 'bg-gray-700',
    [PokemonType.FAIRY]: 'bg-pink-400',
    [PokemonType.FIGHTING]: 'bg-red-700',
    [PokemonType.POISON]: 'bg-purple-600',
    [PokemonType.GROUND]: 'bg-yellow-600',
    [PokemonType.FLYING]: 'bg-indigo-400',
    [PokemonType.BUG]: 'bg-green-600',
    [PokemonType.ROCK]: 'bg-yellow-800',
    [PokemonType.GHOST]: 'bg-purple-800',
    [PokemonType.STEEL]: 'bg-gray-500',
    [PokemonType.NORMAL]: 'bg-gray-400',
};

export function PokemonForm({ initialData, onSubmit, onCancel, isLoading = false, submitLabel = "Save Pokémon", error }: PokemonFormProps) {
    const [newAbility, setNewAbility] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid, isDirty },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || '',
            type: initialData?.type || PokemonType.NORMAL,
            height: initialData?.height || 0,
            weight: initialData?.weight || 0,
            imageUrl: initialData?.imageUrl || '',
            abilities: initialData?.abilities?.map(pa => pa.ability.name) || [],
        },
    });

    const watchedImageUrl = watch('imageUrl');
    const watchedAbilities = watch('abilities');
    const watchedType = watch('type');

    useEffect(() => {
        if (watchedImageUrl && watchedImageUrl.startsWith('http')) {
            setImagePreview(watchedImageUrl);
        } else {
            setImagePreview(null);
        }
    }, [watchedImageUrl]);

    const handleFormSubmit = (data: FormData) => {
        onSubmit({
            ...data,
            abilities: data.abilities,
        });
    };

    const addAbility = () => {
        if (!newAbility.trim()) return;

        const currentAbilities = watchedAbilities || [];
        if (currentAbilities.includes(newAbility.trim())) {
            setNewAbility('');
            return;
        }

        setValue('abilities', [...currentAbilities, newAbility.trim()], { shouldValidate: true });
        setNewAbility('');
    };

    const removeAbility = (abilityToRemove: string) => {
        const currentAbilities = watchedAbilities || [];
        setValue('abilities', currentAbilities.filter(ability => ability !== abilityToRemove), { shouldValidate: true });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addAbility();
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error instanceof Error ? error.message : 'An error occurred while saving the Pokémon'}
                    </AlertDescription>
                </Alert>
            )}

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${typeColors[watchedType]} rounded-lg flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">#</span>
                        </div>
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                placeholder="Enter Pokémon name"
                                className="capitalize"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type">Type *</Label>
                            <Select
                                value={watchedType}
                                onValueChange={(value) => setValue('type', value as PokemonType, { shouldValidate: true })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {pokemonTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 ${typeColors[type]} rounded-full`} />
                                                <span className="capitalize">{type.toLowerCase()}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-red-600">{errors.type.message}</p>
                            )}
                        </div>

                        {/* Height */}
                        <div className="space-y-2">
                            <Label htmlFor="height">Height (meters) *</Label>
                            <Input
                                id="height"
                                type="number"
                                step="0.1"
                                min="0"
                                {...register('height', { valueAsNumber: true })}
                                placeholder="0.0"
                            />
                            {errors.height && (
                                <p className="text-sm text-red-600">{errors.height.message}</p>
                            )}
                        </div>

                        {/* Weight */}
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg) *</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                min="0"
                                {...register('weight', { valueAsNumber: true })}
                                placeholder="0.0"
                            />
                            {errors.weight && (
                                <p className="text-sm text-red-600">{errors.weight.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="imageUrl"
                                    {...register('imageUrl')}
                                    placeholder="https://example.com/pokemon.png"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        {errors.imageUrl && (
                            <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
                        )}

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mt-3">
                                <img
                                    src={imagePreview}
                                    alt="Pokemon preview"
                                    className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                                    onError={() => setImagePreview(null)}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Abilities */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        Abilities
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add New Ability */}
                    <div className="space-y-3">
                        <Label>Add Ability</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newAbility}
                                onChange={(e) => setNewAbility(e.target.value)}
                                placeholder="Enter ability name (e.g., Static, Blaze)"
                                onKeyPress={handleKeyPress}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={addAbility}
                                disabled={!newAbility.trim() || (watchedAbilities?.length || 0) >= 6}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Maximum 6 abilities. Press Enter or click + to add.
                        </p>
                    </div>

                    {/* Current Abilities */}
                    <div className="space-y-3">
                        <Label>Selected Abilities ({watchedAbilities?.length || 0}/6)</Label>
                        <div className="flex flex-wrap gap-2">
                            {watchedAbilities && watchedAbilities.length > 0 ? (
                                watchedAbilities.map((ability) => (
                                    <Badge
                                        key={ability}
                                        variant="secondary"
                                        className="flex items-center gap-2 px-3 py-1 text-sm"
                                    >
                                        {ability}
                                        <button
                                            type="button"
                                            onClick={() => removeAbility(ability)}
                                            className="ml-1 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 py-4">No abilities selected</p>
                            )}
                        </div>
                        {errors.abilities && (
                            <p className="text-sm text-red-600">{errors.abilities.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                    type="submit"
                    disabled={isLoading || !isValid}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Saving...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            {submitLabel}
                        </div>
                    )}
                </Button>

                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    disabled={isLoading}
                    className="font-medium"
                >
                    Cancel
                </Button>

                {initialData && isDirty && (
                    <Button
                        type="button"
                        onClick={() => reset()}
                        variant="ghost"
                        disabled={isLoading}
                        className="text-gray-600"
                    >
                        Reset Changes
                    </Button>
                )}
            </div>
        </form>
    );
}