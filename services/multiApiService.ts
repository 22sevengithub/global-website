// Multi-API Service - Fetch providers from multiple backends simultaneously
// This allows showing both UAE banks (Lean) and SA banks (Yodlee) at the same time

import axios, { AxiosInstance } from 'axios';
import { ServiceProvider } from '../types';

/**
 * Configuration for each API endpoint
 */
interface ApiConfig {
  name: string;
  baseUrl: string;
  signalRUrl?: string;
  priority: number; // Higher priority wins on conflicts
  enabled: boolean;
}

/**
 * Provider with source API metadata
 */
export interface EnhancedServiceProvider extends ServiceProvider {
  sourceApi?: string;           // Which API this came from
  encryptionKey?: string;        // Provider-specific encryption key
  apiBaseUrl?: string;           // Which API to use for linking
}

/**
 * Multi-API configuration
 * Add/remove APIs as needed
 *
 * IMPORTANT: Based on Flutter SA project analysis:
 * - Development: https://api.develop.my227.net (mock data only)
 * - Pre-production: https://api.preprod.vault22.io (REAL Yodlee banks!)
 * - Production: https://api.22seven.com (REAL Yodlee banks, requires valid SA credentials)
 *
 * STRATEGY: Use Flutter app's Pre-Prod API for REAL Yodlee/SA banks + Global API for Lean/UAE banks
 *
 * TO ENABLE REAL YODLEE BANKS:
 * Option 1: Set NEXT_PUBLIC_SA_PREPROD_API_URL=https://api.preprod.vault22.io (recommended for testing)
 * Option 2: Set NEXT_PUBLIC_SA_PROD_API_URL=https://api.22seven.com (requires production credentials)
 */
const API_CONFIGS: ApiConfig[] = [
  // Option 1: SA Production API (Flutter's prod API - REAL Yodlee banks)
  // Highest priority - use this if you have production SA credentials
  {
    name: 'SA Production (22seven)',
    baseUrl: process.env.NEXT_PUBLIC_SA_PROD_API_URL || '',
    signalRUrl: 'https://signal.22seven.com',
    priority: 110,
    enabled: !!process.env.NEXT_PUBLIC_SA_PROD_API_URL,
  },
  // Option 2: SA Pre-Production API (Flutter's preprod API - REAL Yodlee banks)
  // Use this for testing with real banks without production credentials
  {
    name: 'SA Pre-Production',
    baseUrl: process.env.NEXT_PUBLIC_SA_PREPROD_API_URL || '',
    signalRUrl: 'https://steph.preprod.vault22.io',
    priority: 105,
    enabled: !!process.env.NEXT_PUBLIC_SA_PREPROD_API_URL,
  },
  // Option 3: SA Development API (current default - mock data only)
  {
    name: 'SA Development',
    baseUrl: process.env.NEXT_PUBLIC_SA_API_URL || 'https://api.develop.my227.net',
    signalRUrl: process.env.NEXT_PUBLIC_SIGNALR_URL || 'http://steph.develop.my227.net',
    priority: 100,
    enabled: !!process.env.NEXT_PUBLIC_SA_API_URL || true, // Enable by default
  },
  // Global/UAE API (for Lean banks)
  {
    name: 'Global/UAE Development',
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api-global.dev.vault22.io',
    signalRUrl: 'https://steph.develop.my227.net',
    priority: 90,
    enabled: true,
  },
];

/**
 * Create axios instance for a specific API
 */
function createApiClient(baseUrl: string): AxiosInstance {
  return axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    timeout: 30000,
  });
}

/**
 * Fetch service providers from a single API
 */
async function fetchProvidersFromApi(
  config: ApiConfig,
  customerId?: string
): Promise<EnhancedServiceProvider[]> {
  try {
    console.log(`🔍 [MultiAPI] Fetching providers from ${config.name} (${config.baseUrl})...`);

    const client = createApiClient(config.baseUrl);

    // Try to fetch aggregate data
    let response;
    let encryptionKey = '';

    if (customerId) {
      // Strategy 1: Try authenticated request with session tokens
      const sessionToken = sessionStorage.getItem('sessionToken');
      const requestToken = sessionStorage.getItem('requestToken');

      if (sessionToken && requestToken) {
        try {
          console.log(`   Trying authenticated fetch from ${config.name}...`);
          response = await client.get(`/customer/${customerId}/aggregate`, {
            headers: {
              'X-SESSION-TOKEN': sessionToken,
              'X-REQUEST-TOKEN': requestToken,
            },
          });
          encryptionKey = response.data.config?.encryptionKey || '';
          console.log(`   ✅ Authenticated fetch successful from ${config.name}`);
          console.log(`      Response has serviceProviders: ${!!response.data.serviceProviders}`);
          console.log(`      Provider count: ${response.data.serviceProviders?.length || 0}`);
        } catch (authError: any) {
          // If auth fails (401, 403), try public endpoints
          if (authError.response?.status === 401 || authError.response?.status === 403) {
            console.log(`   ⚠️ Auth failed for ${config.name} (${authError.response.status}), trying public endpoint...`);

            // Strategy 2: Try public service providers endpoint
            try {
              response = await client.get('/service-providers');
              console.log(`   ✅ Public endpoint successful from ${config.name}`);
            } catch (publicError: any) {
              // Strategy 3: Try config endpoint for encryption key
              console.log(`   ⚠️ No public service providers endpoint, trying /config...`);
              try {
                const configResponse = await client.get('/config');
                encryptionKey = configResponse.data?.encryptionKey || '';

                // Now try anonymous aggregate fetch
                response = await client.get('/aggregate');
                console.log(`   ✅ Anonymous aggregate fetch successful from ${config.name}`);
              } catch (configError) {
                console.warn(`   ❌ All fetch strategies failed for ${config.name}`);
                return [];
              }
            }
          } else {
            // Network error, CORS, or other issue
            throw authError;
          }
        }
      } else {
        console.log(`   ℹ️ No auth tokens, attempting public fetch from ${config.name}...`);

        // Try public endpoint without auth
        try {
          response = await client.get('/service-providers');
        } catch (error) {
          console.warn(`   ⚠️ Public fetch failed for ${config.name}`);
          return [];
        }
      }
    } else {
      // No customerId - try public endpoint
      console.log(`   ℹ️ No customerId, attempting public fetch from ${config.name}...`);

      try {
        response = await client.get('/service-providers');
      } catch (publicError) {
        console.warn(`   ⚠️ ${config.name} requires authentication, skipping`);
        return [];
      }
    }

    const data = response.data;
    const serviceProviders: ServiceProvider[] = data.serviceProviders || [];

    // If encryptionKey wasn't set earlier, try to get it from response
    if (!encryptionKey) {
      encryptionKey = data.config?.encryptionKey || '';
    }

    console.log(`✅ [MultiAPI] Fetched ${serviceProviders.length} providers from ${config.name}`);

    // Log provider type breakdown for debugging
    const yodleeCount = serviceProviders.filter(p =>
      p.accountLoginForm?.accountLoginFields && p.accountLoginForm.accountLoginFields.length > 0
    ).length;
    const leanCount = serviceProviders.filter(p => p.integrationProvider === 'LEAN').length;
    const vezgoCount = serviceProviders.filter(p => p.integrationProvider === 'VEZGO').length;

    console.log(`   Provider breakdown:`);
    console.log(`      - Yodlee (has accountLoginForm): ${yodleeCount}`);
    console.log(`      - Lean (UAE): ${leanCount}`);
    console.log(`      - Vezgo (Crypto): ${vezgoCount}`);

    // Enhance providers with source metadata
    const enhancedProviders: EnhancedServiceProvider[] = serviceProviders.map(p => ({
      ...p,
      sourceApi: config.name,
      encryptionKey: encryptionKey,
      apiBaseUrl: config.baseUrl,
    }));

    return enhancedProviders;
  } catch (error: any) {
    console.error(`❌ [MultiAPI] Failed to fetch from ${config.name}:`, error.message);
    console.error(`   Error details:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      url: error.config?.url,
      isNetworkError: error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK',
      isCorsError: error.message?.includes('CORS') || error.message?.includes('Network Error'),
    });
    return [];
  }
}

/**
 * Merge providers from multiple APIs
 * Deduplicates by provider ID, keeping the one from highest priority API
 */
function mergeProviders(
  providersByApi: Map<string, EnhancedServiceProvider[]>
): EnhancedServiceProvider[] {
  const providerMap = new Map<string, EnhancedServiceProvider>();

  // Sort configs by priority (highest first)
  const sortedConfigs = [...API_CONFIGS].sort((a, b) => b.priority - a.priority);

  // Merge providers, higher priority overwrites
  for (const config of sortedConfigs) {
    const providers = providersByApi.get(config.name) || [];

    for (const provider of providers) {
      const key = provider.id || provider.ttsId;

      if (!providerMap.has(key)) {
        providerMap.set(key, provider);
      } else {
        // Provider already exists from higher priority API
        console.log(`🔄 [MultiAPI] Skipping duplicate provider "${provider.name}" from ${config.name} (already from higher priority API)`);
      }
    }
  }

  const merged = Array.from(providerMap.values());

  console.log(`✅ [MultiAPI] Merged ${merged.length} unique providers from ${providersByApi.size} APIs`);

  // Count by source
  const countsBySource = merged.reduce((acc, p) => {
    acc[p.sourceApi || 'unknown'] = (acc[p.sourceApi || 'unknown'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log(`📊 [MultiAPI] Providers by source:`, countsBySource);

  return merged;
}

/**
 * Main function: Fetch service providers from all enabled APIs
 */
export async function fetchProvidersFromAllApis(
  customerId?: string
): Promise<EnhancedServiceProvider[]> {
  console.log('');
  console.log('='.repeat(80));
  console.log('🌍🌍🌍 [MultiAPI] fetchProvidersFromAllApis() CALLED');
  console.log('   Customer ID:', customerId);
  console.log('   Has session tokens?', {
    sessionToken: !!sessionStorage.getItem('sessionToken'),
    requestToken: !!sessionStorage.getItem('requestToken')
  });
  console.log('='.repeat(80));
  console.log('');

  const enabledConfigs = API_CONFIGS.filter(c => c.enabled);

  console.log(`📡 [MultiAPI] Found ${enabledConfigs.length} enabled APIs:`);
  enabledConfigs.forEach(c => {
    console.log(`   - ${c.name}: ${c.baseUrl} (priority: ${c.priority})`);
  });

  // Fetch from all APIs in parallel
  const fetchPromises = enabledConfigs.map(async (config) => {
    const providers = await fetchProvidersFromApi(config, customerId);
    return { config, providers };
  });

  const results = await Promise.all(fetchPromises);

  // Build map of providers by API
  const providersByApi = new Map<string, EnhancedServiceProvider[]>();
  for (const { config, providers } of results) {
    providersByApi.set(config.name, providers);
  }

  // Merge all providers
  const mergedProviders = mergeProviders(providersByApi);

  console.log(`✅ [MultiAPI] Total providers available: ${mergedProviders.length}`);

  return mergedProviders;
}

/**
 * Get the correct API base URL for a provider
 * Used when linking accounts - ensures we hit the right backend
 */
export function getProviderApiUrl(provider: EnhancedServiceProvider): string {
  return provider.apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || 'https://api-global.dev.vault22.io';
}

/**
 * Get the correct encryption key for a provider
 * Used when encrypting credentials - ensures we use the right RSA key
 */
export function getProviderEncryptionKey(
  provider: EnhancedServiceProvider,
  fallbackKey: string
): string {
  return provider.encryptionKey || fallbackKey;
}

/**
 * Check if multi-API mode is enabled
 */
export function isMultiApiEnabled(): boolean {
  const enabledCount = API_CONFIGS.filter(c => c.enabled).length;
  console.log('🔍🔍🔍 [MultiAPI] isMultiApiEnabled() called');
  console.log('   API_CONFIGS:', API_CONFIGS.map(c => ({ name: c.name, enabled: c.enabled, baseUrl: c.baseUrl })));
  console.log('   Enabled APIs count:', enabledCount);
  console.log('   Multi-API enabled?', enabledCount > 1);
  return enabledCount > 1;
}

/**
 * Get list of enabled APIs
 */
export function getEnabledApis(): ApiConfig[] {
  return API_CONFIGS.filter(c => c.enabled);
}
