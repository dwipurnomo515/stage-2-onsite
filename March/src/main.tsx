import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./global.css";
import { Provider } from 'react-redux';
import { store } from './store/redux.ts';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={new QueryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
