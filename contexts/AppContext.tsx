// Global App Context for Vault22

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Aggregate, CustomerInfo } from '../types';
import { customerApi } from '../services/api';

interface AppContextType {
  // Auth state
  isAuthenticated: boolean;
  customerId: string | null;

  // Data state
  aggregate: Aggregate | null;
  customerInfo: CustomerInfo | null;
  loading: boolean;
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
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    const storedCustomerId = localStorage.getItem('customerId');

    if (sessionToken && storedCustomerId) {
      setIsAuthenticated(true);
      setCustomerId(storedCustomerId);
      loadAggregate(storedCustomerId);
    }
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
      const data = await customerApi.getAggregate(id);
      setAggregate(data);
      setCustomerInfo(data.customerInfo);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Failed to load aggregate:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshAggregate = async () => {
    if (!customerId) return;

    try {
      // Get deltas since last update
      const lastUpdated = aggregate?.customerInfo?.updatedAt;
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

  const logout = () => {
    setIsAuthenticated(false);
    setCustomerId(null);
    setAggregate(null);
    setCustomerInfo(null);
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('requestToken');
    localStorage.removeItem('customerId');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        customerId,
        aggregate,
        customerInfo,
        loading,
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
