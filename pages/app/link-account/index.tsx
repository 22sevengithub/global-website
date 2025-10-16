import AppShell from '../../../components/AppShell';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingAnimation from '../../../components/LoadingAnimation';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../../contexts/AppContext';
import { ServiceProvider } from '../../../types';

export default function LinkAccount() {
  const router = useRouter();
  const { aggregate, loading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Get providers from aggregate data with type detection
  const providers = useMemo(() => {
    console.log('[LinkAccount] 🔍 ULTRA DEBUG START ==========');
    console.log('[LinkAccount] Aggregate exists?', !!aggregate);
    console.log('[LinkAccount] Aggregate keys:', aggregate ? Object.keys(aggregate) : 'NO AGGREGATE');
    console.log('[LinkAccount] serviceProviders exists?', !!aggregate?.serviceProviders);
    console.log('[LinkAccount] serviceProviders type:', typeof aggregate?.serviceProviders);
    console.log('[LinkAccount] serviceProviders is array?', Array.isArray(aggregate?.serviceProviders));

    if (!aggregate?.serviceProviders) {
      console.log('[LinkAccount] ❌ No service providers in aggregate');
      console.log('[LinkAccount] Full aggregate structure:', JSON.stringify(aggregate, null, 2).substring(0, 500));
      return [];
    }

    console.log('[LinkAccount] ========== PROVIDERS LOADED ==========');
    console.log('[LinkAccount] Total providers in aggregate:', aggregate.serviceProviders.length);

    // Add provider type detection
    const providersWithType = aggregate.serviceProviders.map(p => {
      let providerType = 'UNKNOWN';

      if (p.integrationProvider === 'LEAN') {
        providerType = 'LEAN';
      } else if (p.integrationProvider === 'VEZGO') {
        providerType = 'VEZGO';
      } else if (p.accountLoginForm?.accountLoginFields && p.accountLoginForm.accountLoginFields.length > 0) {
        providerType = 'YODLEE';
      }

      return { ...p, providerType };
    });

    // Log first 5 providers to see structure
    console.log('[LinkAccount] Sample providers (first 5):',
      providersWithType.slice(0, 5).map(p => ({
        name: p.name,
        id: p.id,
        ttsId: p.ttsId,
        integrationProvider: p.integrationProvider,
        providerType: p.providerType,
        hasLoginForm: !!p.accountLoginForm,
        loginFieldCount: p.accountLoginForm?.accountLoginFields?.length || 0,
      }))
    );

    // Filter to only show providers that can be linked
    const linkableProviders = providersWithType.filter(p => p.canLink !== false);

    // Count by type
    const typeCounts = linkableProviders.reduce((acc, p) => {
      acc[p.providerType] = (acc[p.providerType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('[LinkAccount] Linkable providers:', linkableProviders.length);
    console.log('[LinkAccount] Providers by type:', typeCounts);
    console.log('[LinkAccount] ==========================================');
    return linkableProviders;
  }, [aggregate]);

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get popular providers (providers with sortOrder)
  const popularProviders = providers
    .filter(p => p.sortOrder !== undefined && p.sortOrder !== null)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .slice(0, 6); // Show top 6 popular providers

  const handleSelectProvider = (provider: ServiceProvider) => {
    console.log('[LinkAccount] ========== PROVIDER SELECTION DEBUG ==========');
    console.log('[LinkAccount] Raw provider object:', JSON.stringify(provider, null, 2));
    console.log('[LinkAccount] Provider keys:', Object.keys(provider));
    console.log('[LinkAccount] Provider.id type:', typeof provider.id, 'value:', provider.id);
    console.log('[LinkAccount] Provider.ttsId type:', typeof provider.ttsId, 'value:', provider.ttsId);

    // Use provider.id as the identifier (backend uses 'id', not 'ttsId')
    const providerId = provider.id || provider.ttsId;

    console.log('[LinkAccount] Selected Provider Details:', {
      name: provider.name,
      id: provider.id,
      ttsId: provider.ttsId,
      providerId: providerId,
      hasForm: !!provider.accountLoginForm,
      fieldCount: provider.accountLoginForm?.accountLoginFields?.length || 0,
      integrationProvider: provider.integrationProvider,
      authType: provider.authType,
    });

    // Validate provider data
    if (!providerId) {
      console.error('[LinkAccount] ❌ CRITICAL: Provider has no id or ttsId!');
      console.error('[LinkAccount] Full provider object:', provider);
      alert('Invalid provider data. Please try another provider.');
      return;
    }

    console.log('[LinkAccount] ✅ Provider ID valid:', providerId);
    console.log('[LinkAccount] Navigating to:', {
      pathname: '/app/link-account/form',
      query: { providerId: providerId }
    });

    // Navigate to linking form with provider data
    router.push({
      pathname: '/app/link-account/form',
      query: { providerId: providerId }
    });

    console.log('[LinkAccount] Navigation initiated');
    console.log('[LinkAccount] ================================================');
  };

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Link Account | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <LoadingAnimation size={150} />
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mt-4">Loading...</p>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppShell title="Link Account | Vault22">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-vault-green flex items-center justify-center text-white font-bold text-sm">
                ✓
              </div>
              <div className="w-12 h-1 bg-vault-green"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-vault-green flex items-center justify-center text-white font-bold text-sm">
                ✓
              </div>
              <div className="w-12 h-1 bg-vault-green"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-vault-green flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div className="w-12 h-1 bg-vault-gray-300 dark:bg-vault-gray-700"></div>
            </div>
            <div className="w-8 h-8 rounded-full bg-vault-gray-300 dark:bg-vault-gray-700 flex items-center justify-center text-vault-gray-600 dark:text-vault-gray-400 font-bold text-sm">
              4
            </div>
          </div>
          <p className="text-center text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-6">
            Step 3 of 4
          </p>
        </div>

        {/* Header */}
        <div className="mb-6">
          <Link href="/app/select-account-type" className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
            Link Your Account
          </h1>
          <p className="text-vault-gray-600 dark:text-vault-gray-400">
            Search for your bank or financial institution
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-vault-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for your bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Popular Providers Section (only when not searching) */}
        {!searchQuery && popularProviders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-vault-black dark:text-white mb-4">
              Popular Accounts
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularProviders.map((provider) => (
                <button
                  key={provider.id || provider.ttsId}
                  onClick={() => handleSelectProvider(provider)}
                  className="bg-white dark:bg-vault-gray-800 p-4 rounded-xl border-2 border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg transition-all text-center group"
                >
                  <div className="w-16 h-16 bg-vault-gray-100 dark:bg-vault-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    {provider.logoUrl || provider.logo ? (
                      <img
                        src={provider.logoUrl || provider.logo || `https://spi.22seven.com/${provider.id || provider.ttsId}.png`}
                        alt={provider.name}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-2xl">🏦</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-vault-black dark:text-white group-hover:text-vault-green transition-colors">
                    {provider.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {provider.isBeta && (
                      <span className="inline-block px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold rounded">
                        BETA
                      </span>
                    )}
                    {(provider as any).providerType === 'YODLEE' && (
                      <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded">
                        SA Bank
                      </span>
                    )}
                    {(provider as any).providerType === 'LEAN' && (
                      <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded">
                        UAE Bank
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Service Providers Section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-vault-black dark:text-white mb-4">
            {searchQuery ? 'Search Results' : 'All Service Providers'}
          </h2>
        </div>

        {/* Service Provider List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-vault-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
              <p className="text-vault-gray-600 dark:text-vault-gray-400">
                No providers found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            filteredProviders.map((provider) => (
              <button
                key={provider.id || provider.ttsId}
                onClick={() => handleSelectProvider(provider)}
                className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border-2 border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-vault-gray-100 dark:bg-vault-gray-700 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    {provider.logoUrl || provider.logo ? (
                      <img
                        src={provider.logoUrl || provider.logo || `https://spi.22seven.com/${provider.id || provider.ttsId}.png`}
                        alt={provider.name}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-2xl">🏦</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-vault-black dark:text-white group-hover:text-vault-green transition-colors">
                      {provider.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {provider.isBeta && (
                        <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold rounded">
                          BETA
                        </span>
                      )}
                      {(provider as any).providerType === 'YODLEE' && (
                        <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded">
                          🇿🇦 SA Bank
                        </span>
                      )}
                      {(provider as any).providerType === 'LEAN' && (
                        <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded">
                          🇦🇪 UAE Bank
                        </span>
                      )}
                      {(provider as any).providerType === 'VEZGO' && (
                        <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-semibold rounded">
                          Crypto
                        </span>
                      )}
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-vault-gray-400 group-hover:text-vault-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
