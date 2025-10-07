// Global App Context for Vault22

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Aggregate, CustomerInfo } from '../types';
import { customerApi } from '../services/api';
import { postLoginDataService } from '../services/postLoginDataService';

interface AppContextType {
  // Auth state
  isAuthenticated: boolean;
  customerId: string | null;

  // Data state
  aggregate: Aggregate | null;
  customerInfo: CustomerInfo | null;
  loading: boolean;
  loadingPhase: 'critical' | 'realtime' | 'background' | 'complete' | null;
  error: string | null;

  // Actions
  setAuthenticated: (isAuth: boolean, custId?: string) => void;
  loadAggregate: () => Promise<void>;
  refreshAggregate: () => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [aggregate, setAggregate] = useState<Aggregate | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<'critical' | 'realtime' | 'background' | 'complete' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const sessionToken = sessionStorage.getItem('sessionToken');
    const storedCustomerId = sessionStorage.getItem('customerId');

    if (sessionToken && storedCustomerId) {
      setIsAuthenticated(true);
      setCustomerId(storedCustomerId);

      // Try to load cached exchange rates immediately for faster initial render
      const cachedRates = localStorage.getItem('EXCHANGE_RATES');
      if (cachedRates && aggregate) {
        try {
          const rates = JSON.parse(cachedRates);
          setAggregate({ ...aggregate, exchangeRates: rates });
        } catch (error) {
          console.warn('Failed to load cached rates on mount');
        }
      }

      loadAggregate(storedCustomerId);
    }

    // Listen for SignalR aggregate updates
    const handleAggregateUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('📊 AppContext: Aggregate update event received', customEvent.detail);

      // Refresh aggregate with delta sync
      if (storedCustomerId) {
        refreshAggregate();
      }
    };

    window.addEventListener('aggregateUpdated', handleAggregateUpdate);

    return () => {
      window.removeEventListener('aggregateUpdated', handleAggregateUpdate);
    };
  }, []);

  const setAuthenticated = (isAuth: boolean, custId?: string) => {
    setIsAuthenticated(isAuth);
    if (custId) {
      setCustomerId(custId);
      loadAggregate(custId);
    }
  };

  const loadAggregate = async (custId?: string) => {
    const id = custId || customerId;
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // Phase 1: Critical data (includes exchange rates)
      setLoadingPhase('critical');
      const data = await postLoginDataService.fetchCriticalData(id);

      // Load exchange rates from localStorage (fetched in Phase 0 of postLoginDataService)
      const cachedRates = localStorage.getItem('EXCHANGE_RATES');
      if (cachedRates) {
        try {
          data.exchangeRates = JSON.parse(cachedRates);
        } catch (error) {
          console.warn('Failed to parse cached exchange rates:', error);
        }
      }

      setAggregate(data);
      setCustomerInfo(data.customerInfo);

      // Update supported currencies in CurrencyContext
      const defaultCurrency = data.customerInfo?.defaultCurrencyCode || data.profile?.baseCurrency;
      if (data.supportedCurrencies && data.baseCurrency && (window as any).__updateSupportedCurrencies) {
        (window as any).__updateSupportedCurrencies(data.supportedCurrencies, data.baseCurrency, defaultCurrency);
      } else if (data.profile?.supportedCurrencies && data.profile?.baseCurrency && (window as any).__updateSupportedCurrencies) {
        (window as any).__updateSupportedCurrencies(data.profile.supportedCurrencies, data.profile.baseCurrency, defaultCurrency);
      }

      // Stop blocking loading - allow UI to render with critical data
      setLoading(false);

      // Phase 2: Real-time setup (background)
      setLoadingPhase('realtime');
      await postLoginDataService.setupRealTimeConnection();

      // Phase 3: Background fetch (non-blocking)
      setLoadingPhase('background');
      postLoginDataService.fetchBackgroundData(id);

      setLoadingPhase('complete');
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Failed to load aggregate:', err);
      setLoading(false);
    }
  };

  const refreshAggregate = async () => {
    if (!customerId) return;

    try {
      // Get deltas since last update
      const lastUpdated = (aggregate as any)?.customerInfo?.updatedAt;
      const data = await customerApi.getAggregate(
        customerId,
        lastUpdated,
        true
      );

      // Merge delta data with existing aggregate
      // For simplicity, just replace for now
      setAggregate(data);
      setCustomerInfo(data.customerInfo);
    } catch (err: any) {
      console.error('Failed to refresh aggregate:', err);
    }
  };

  const logout = async () => {
    console.log('🚪 Logging out...');

    try {
      // 1. Disconnect SignalR first
      try {
        const { getSignalRService } = await import('../services/signalRService');
        const signalRService = getSignalRService();
        await signalRService.unsubscribe();
        console.log('✅ SignalR disconnected');
      } catch (error) {
        console.warn('⚠️ Failed to disconnect SignalR:', error);
      }

      // 2. Call API logout endpoint
      try {
        const { authApi } = await import('../services/api');
        await authApi.logout();
        console.log('✅ API logout successful');
      } catch (error) {
        console.warn('⚠️ API logout failed (continuing with local logout):', error);
      }

      // 3. Clear all local state
      setIsAuthenticated(false);
      setCustomerId(null);
      setAggregate(null);
      setCustomerInfo(null);
      setLoading(false);
      setLoadingPhase(null);
      setError(null);

      // 4. Clear all session storage
      sessionStorage.clear();

      // 5. Clear all cached data from localStorage (keep theme preference)
      const theme = localStorage.getItem('theme');
      const itemsToKeep = ['theme'];

      Object.keys(localStorage).forEach(key => {
        if (!itemsToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // Restore theme if it existed
      if (theme) {
        localStorage.setItem('theme', theme);
      }

      console.log('✅ Logout complete - all data cleared');

      // 6. Small delay for smooth UI transition, then redirect to homepage
      await new Promise(resolve => setTimeout(resolve, 500));

      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force redirect even on error
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        customerId,
        aggregate,
        customerInfo,
        loading,
        loadingPhase,
        error,
        setAuthenticated,
        loadAggregate,
        refreshAggregate,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
