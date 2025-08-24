import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NuqsAdapter } from 'nuqs/adapters/react-router';
import { queryClient } from '@/lib/queryClient';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { CreatePokemonPage } from '@/pages/CreatePokemonPage';
import { EditPokemonPage } from '@/pages/EditPokemonPage';
import { PokemonDetailPage } from '@/pages/PokemonDetailPage';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <NuqsAdapter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route path="create" element={<CreatePokemonPage />} />
                            <Route path="pokemon/:id" element={<PokemonDetailPage />} />
                            <Route path="pokemon/:id/edit" element={<EditPokemonPage />} />
                        </Route>
                    </Routes>
                </NuqsAdapter>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;