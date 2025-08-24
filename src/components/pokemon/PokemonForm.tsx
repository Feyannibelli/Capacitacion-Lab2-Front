import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, ImageIcon } from 'lucide-react';
import { Pokemon, CreatePokemonData, UpdatePokemonData } from '@/types/pokemon';

const pokemonSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
    type: z.array(z.string()).min(1, 'At least one type is required').max(2, 'Maximum 2 types allowed'),
    height: z.number().min(0.1, 'Height must be positive').max(50, 'Height too large'),
    weight: z.number().min(0.1, 'Weight must be positive').max(1000, 'Weight too large'),
    imageUrl: z.string().url('Must be a valid URL'),
    abilities: z.array(z.string()).min(1, 'At least one ability is required'),
    moves: z.array(z.string()).min(1, 'At least one move is required'),
});

type PokemonFormData = z.infer<typeof pokemonSchema>;

interface PokemonFormProps {
    pokemon?: Pokemon;
    onSubmit: (data: CreatePokemonData | UpdatePokemonData) => void;
    isLoading?: boolean;
}

const POKEMON_TYPES = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic',
    'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];

export function PokemonForm({ pokemon, onSubmit, isLoading = false }: PokemonFormProps) {
    const [imagePreview, setImagePreview] = useState(pokemon?.imageUrl || '');
    const isEditing = !!pokemon;

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PokemonFormData>({
        resolver: zodResolver(pokemonSchema),
        defaultValues: pokemon ? {
            name: pokemon.name,
            type: pokemon.type,
            height: pokemon.height,
            weight: pokemon.weight,
            imageUrl: pokemon.imageUrl,
            abilities: pokemon.abilities,
            moves: pokemon.moves,
        } : {
            name: '',
            type: [],
            height: 0,
            weight: 0,
            imageUrl: '',
            abilities: [''],
            moves: [''],
        },
    });

    const {
        fields: abilityFields,
        append: appendAbility,
        remove: removeAbility,
    } = useFieldArray({
        control,
        name: 'abilities',
    });

    const {
        fields: moveFields,
        append: appendMove,
        remove: removeMove,
    } = useFieldArray({
        control,
        name: 'moves',
    });

    const watchImageUrl = watch('imageUrl');
    const watchTypes = watch('type');

    // Update image preview when URL changes
    useState(() => {
        if (watchImageUrl && watchImageUrl !== imagePreview) {
            setImagePreview(watchImageUrl);
        }
    }, [watchImageUrl]);

    const handleFormSubmit = (data: PokemonFormData) => {
        if (isEditing) {
            onSubmit({ ...data, id: pokemon.id });
        } else {
            onSubmit(data);
        }
    };

    const addType = (type: string) => {
        if (watchTypes.length < 2 && !watchTypes.includes(type)) {
            setValue('type', [...watchTypes, type]);
        }
    };

    const removeType = (typeToRemove: string) => {
        setValue('type', watchTypes.filter(type => type !== typeToRemove));
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                placeholder="Enter Pokémon name"
                            />
                            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Label>Types (max 2)</Label>
                            <Select onValueChange={addType} disabled={watchTypes.length >= 2}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Add a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {POKEMON_TYPES.filter(type => !watchTypes.includes(type)).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {watchTypes.map((type) => (
                                    <Badge key={type} variant="secondary" className="flex items-center gap-1">
                                        {type}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 hover:bg-transparent"
                                            onClick={() => removeType(type)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                            {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="height">Height (m)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    step="0.1"
                                    {...register('height', { valueAsNumber: true })}
                                    placeholder="1.2"
                                />
                                {errors.height && <p className="text-sm text-red-600 mt-1">{errors.height.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    {...register('weight', { valueAsNumber: true })}
                                    placeholder="25.5"
                                />
                                {errors.weight && <p className="text-sm text-red-600 mt-1">{errors.weight.message}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Image */}
                <Card>
                    <CardHeader>
                        <CardTitle>Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                {...register('imageUrl')}
                                placeholder="https://example.com/pokemon-image.jpg"
                            />
                            {errors.imageUrl && <p className="text-sm text-red-600 mt-1">{errors.imageUrl.message}</p>}
                        </div>

                        {imagePreview && (
                            <div className="border rounded-lg p-4">
                                <p className="text-sm font-medium mb-2">Preview:</p>
                                <div className="w-48 h-48 mx-auto bg-gray-50 rounded-lg overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={() => setImagePreview('')}
                                    />
                                </div>
                            </div>
                        )}
                        {!imagePreview && (
                            <div className="w-48 h-48 mx-auto bg-gray-50 rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Abilities */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Abilities</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendAbility('')}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Ability
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {abilityFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <Input
                                    {...register(`abilities.${index}`)}
                                    placeholder="Enter ability name"
                                />
                                {abilityFields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeAbility(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.abilities && <p className="text-sm text-red-600 mt-2">{errors.abilities.message}</p>}
                </CardContent>
            </Card>

            {/* Moves */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Moves</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendMove('')}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Move
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {moveFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <Input
                                    {...register(`moves.${index}`)}
                                    placeholder="Enter move name"
                                />
                                {moveFields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeMove(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.moves && <p className="text-sm text-red-600 mt-2">{errors.moves.message}</p>}
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : isEditing ? 'Update Pokémon' : 'Create Pokémon'}
                </Button>
            </div>
        </form>
    );
}