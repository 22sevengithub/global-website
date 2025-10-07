import '../src/styles/globals.css';
import type { AppProps } from 'next/app';
import { AppProvider } from '../contexts/AppContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}