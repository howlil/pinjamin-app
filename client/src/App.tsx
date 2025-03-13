import { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "./routes";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const AppRoutes = () => {
    const element = useRoutes(routes);
    return (
      <Suspense
        fallback={
          <div className="flex h-screen  items-center justify-center">
            Loading...
          </div>
        }
      >
        {element}
      </Suspense>
    );
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
