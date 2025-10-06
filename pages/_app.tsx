import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppProvider } from '../contexts/AppContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CurrencyProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </CurrencyProvider>
  );
}