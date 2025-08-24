import { Pokemon, PokemonListResponse, CreatePokemonData, UpdatePokemonData, PokemonFilters } from '@/types/pokemon';


const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorMessage = await response.text().catch(() => 'Network error');
        throw new ApiError(response.status, errorMessage);
    }
    return response.json();
};

export const pokemonApi = {
    // consigue a todos los pokemon con filtros y paginacion
    getPokemons: async (filters: PokemonFilters): Promise<PokemonListResponse> => {
        const params = new URLSearchParams({
            page: filters.page.toString(),
            limit: filters.limit.toString(),
            ...(filters.search && { search: filters.search }),
            ...(filters.type && { type: filters.type }),
        });

        const response = await fetch(`${API_BASE_URL}/pokemon?${params}`);
        return handleResponse<PokemonListResponse>(response);
    },

    // consigue pokemons por ID
    getPokemon: async (id: number): Promise<Pokemon> => {
        const response = await fetch(`${API_BASE_URL}/pokemon/${id}`);
        return handleResponse<Pokemon>(response);
    },

    // crea nuevos pokemons
    createPokemon: async (data: CreatePokemonData): Promise<Pokemon> => {
        const response = await fetch(`${API_BASE_URL}/pokemon`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse<Pokemon>(response);
    },

    // actuliza pokemons existentes
    updatePokemon: async (data: UpdatePokemonData): Promise<Pokemon> => {
        const response = await fetch(`${API_BASE_URL}/pokemon/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse<Pokemon>(response);
    },

    // borra pokemons existentes
    deletePokemon: async (id: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/pokemon/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorMessage = await response.text().catch(() => 'Failed to delete');
            throw new ApiError(response.status, errorMessage);
        }
    },
};

// para testear el front datos de prueba
export const mockPokemon: Pokemon[] = [
    {
        id: 1,
        name: "Pikachu",
        type: ["Electric"],
        height: 0.4,
        weight: 6.0,
        imageUrl: "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg",
        abilities: ["Static", "Lightning Rod"],
        moves: ["Thunder Shock", "Quick Attack", "Thunder Wave", "Agility"]
    },
    {
        id: 2,
        name: "Charizard",
        type: ["Fire", "Flying"],
        height: 1.7,
        weight: 90.5,
        imageUrl: "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg",
        abilities: ["Blaze", "Solar Power"],
        moves: ["Flamethrower", "Dragon Pulse", "Air Slash", "Roar"]
    },
    {
        id: 3,
        name: "Blastoise",
        type: ["Water"],
        height: 1.6,
        weight: 85.5,
        imageUrl: "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg",
        abilities: ["Torrent", "Rain Dish"],
        moves: ["Water Gun", "Hydro Pump", "Ice Beam", "Withdraw"]
    }
];