import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import { HomePage } from '@/pages/HomePage';
import { PokemonDetailPage } from '@/pages/PokemonDetailPage';
import { PokemonEditPage } from '@/pages/PokemonEditPage';
import { PokemonCreatePage } from '@/pages/PokemonCreatePage';
import { Navbar } from '@/components/layout/NavBar.tsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
                if (error?.status === 404) return false;
                return failureCount < 3;
            },
        },
        mutations: {
            retry: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/create" element={<PokemonCreatePage />} />
                            <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
                            <Route path="/pokemon/:id/edit" element={<PokemonEditPage />} />
                            {/* Fallback route */}
                            <Route path="*" element={<HomePage />} />
                        </Routes>
                    </main>
                    <Toaster />
                </div>
            </Router>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;