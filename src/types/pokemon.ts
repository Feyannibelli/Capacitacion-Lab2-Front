export enum PokemonType {
    NORMAL = 'NORMAL',
    FIRE = 'FIRE',
    WATER = 'WATER',
    GRASS = 'GRASS',
    ELECTRIC = 'ELECTRIC',
    ICE = 'ICE',
    FIGHTING = 'FIGHTING',
    POISON = 'POISON',
    GROUND = 'GROUND',
    FLYING = 'FLYING',
    PSYCHIC = 'PSYCHIC',
    BUG = 'BUG',
    ROCK = 'ROCK',
    GHOST = 'GHOST',
    DARK = 'DARK',
    DRAGON = 'DRAGON',
    STEEL = 'STEEL',
    FAIRY = 'FAIRY'
}

export interface Ability {
    id: number;
    name: string;
}

export interface PokemonAbility {
    ability: Ability;
}

export interface Pokemon {
    id: number;
    name: string;
    type: PokemonType;
    height: number;
    weight: number;
    imageUrl?: string;
    abilities: PokemonAbility[];
    createdAt: string;
    updatedAt: string;
}

export interface PokemonListResponse {
    items: Pokemon[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PokemonFilters {
    search?: string;
    type?: PokemonType;
    page?: number;
    limit?: number;
    sortBy?: 'id' | 'name' | 'type';
    order?: 'asc' | 'desc';
    abilityIds?: number[];
}

export interface CreatePokemonData {
    name: string;
    type: PokemonType;
    height: number;
    weight: number;
    imageUrl?: string;
    abilities?: string[];
}

export interface UpdatePokemonData extends Partial<CreatePokemonData> {
    id: number;
}