import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { fetchProvidersFromAllApis, isMultiApiEnabled, getEnabledApis } from '../../services/multiApiService';
import axios from 'axios';

interface DebugResult {
  apiName: string;
  apiUrl: string;
  status: 'loading' | 'success' | 'error';
  providerCount: number;
  yodleeCount: number;
  leanCount: number;
  vezgoCount: number;
  sampleProviders: any[];
  error?: string;
  rawResponse?: any;
}

export default function DebugYodlee() {
  const { aggregate, customerInfo, loading } = useApp();
  const [debugResults, setDebugResults] = useState<DebugResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [multiApiResult, setMultiApiResult] = useState<any>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDebugResults([]);
    setMultiApiResult(null);

    const results: DebugResult[] = [];
    const apis = getEnabledApis();

    console.log('');
    console.log('='.repeat(80));
    console.log('🔬 YODLEE DIAGNOSTIC STARTED');
    console.log('='.repeat(80));
    console.log('');

    // Test each API individually
    for (const api of apis) {
      const result: DebugResult = {
        apiName: api.name,
        apiUrl: api.baseUrl,
        status: 'loading',
        providerCount: 0,
        yodleeCount: 0,
        leanCount: 0,
        vezgoCount: 0,
        sampleProviders: [],
      };

      console.log(`\n🔍 Testing ${api.name} (${api.baseUrl})...`);

      try {
        // Try authenticated request first
        const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('sessionToken') : null;
        const requestToken = typeof window !== 'undefined' ? sessionStorage.getItem('requestToken') : null;

        let response;

        if (sessionToken && customerInfo?.id) {
          console.log(`   Attempting authenticated request...`);

          try {
            response = await axios.get(
              `${api.baseUrl}/customer/${customerInfo.id}/aggregate`,
              {
                headers: {
                  'X-SESSION-TOKEN': sessionToken,
                  'X-REQUEST-TOKEN': requestToken || '',
                  'Accept': 'application/json',
                },
                timeout: 15000,
              }
            );
            console.log(`   ✅ Authenticated request successful`);
          } catch (authError: any) {
            console.log(`   ⚠️ Authenticated request failed (${authError.response?.status}), trying public endpoint...`);

            // Try public endpoint
            try {
              response = await axios.get(
                `${api.baseUrl}/service-providers`,
                {
                  headers: { 'Accept': 'application/json' },
                  timeout: 15000,
                }
              );
              console.log(`   ✅ Public endpoint successful`);
            } catch (publicError: any) {
              console.log(`   ❌ Public endpoint also failed`);
              throw authError; // Throw original error
            }
          }
        } else {
          console.log(`   Attempting public request (no auth)...`);
          response = await axios.get(
            `${api.baseUrl}/service-providers`,
            {
              headers: { 'Accept': 'application/json' },
              timeout: 15000,
            }
          );
        }

        const data = response.data;
        const providers = data.serviceProviders || [];

        result.status = 'success';
        result.providerCount = providers.length;
        result.rawResponse = {
          hasServiceProviders: !!data.serviceProviders,
          hasConfig: !!data.config,
          hasEncryptionKey: !!data.config?.encryptionKey,
          providerStructure: providers.length > 0 ? Object.keys(providers[0]) : [],
        };

        // Categorize providers
        providers.forEach((p: any) => {
          if (p.integrationProvider === 'LEAN') {
            result.leanCount++;
          } else if (p.integrationProvider === 'VEZGO') {
            result.vezgoCount++;
          } else if (p.accountLoginForm?.accountLoginFields?.length > 0) {
            result.yodleeCount++;
          }
        });

        // Get sample providers
        result.sampleProviders = providers.slice(0, 3).map((p: any) => ({
          name: p.name,
          id: p.id,
          ttsId: p.ttsId,
          integrationProvider: p.integrationProvider,
          hasAccountLoginForm: !!p.accountLoginForm,
          loginFieldCount: p.accountLoginForm?.accountLoginFields?.length || 0,
        }));

        console.log(`   ✅ Found ${providers.length} providers:`);
        console.log(`      - Yodlee (SA): ${result.yodleeCount}`);
        console.log(`      - Lean (UAE): ${result.leanCount}`);
        console.log(`      - Vezgo (Crypto): ${result.vezgoCount}`);

      } catch (error: any) {
        result.status = 'error';
        result.error = error.message;
        console.error(`   ❌ Error:`, error.message);
      }

      results.push(result);
      setDebugResults([...results]);
    }

    // Test multi-API aggregation
    console.log('\n🌍 Testing multi-API aggregation...');
    try {
      const multiApiProviders = await fetchProvidersFromAllApis(customerInfo?.id);

      const multiApiStats = {
        total: multiApiProviders.length,
        yodlee: multiApiProviders.filter((p: any) =>
          p.accountLoginForm?.accountLoginFields?.length > 0 && !p.integrationProvider
        ).length,
        lean: multiApiProviders.filter((p: any) => p.integrationProvider === 'LEAN').length,
        vezgo: multiApiProviders.filter((p: any) => p.integrationProvider === 'VEZGO').length,
        sampleProviders: multiApiProviders.slice(0, 5).map((p: any) => ({
          name: p.name,
          sourceApi: p.sourceApi,
          hasLoginForm: !!p.accountLoginForm,
          integrationProvider: p.integrationProvider,
        })),
      };

      setMultiApiResult(multiApiStats);
      console.log('   ✅ Multi-API aggregation successful:', multiApiStats);

    } catch (error: any) {
      console.error('   ❌ Multi-API aggregation failed:', error);
      setMultiApiResult({ error: error.message });
    }

    console.log('');
    console.log('='.repeat(80));
    console.log('🔬 YODLEE DIAGNOSTIC COMPLETE');
    console.log('='.repeat(80));
    console.log('');

    setIsRunning(false);
  };

  return (
    <ProtectedRoute>
      <AppShell title="Yodlee Diagnostic | Vault22">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">🔬 Yodlee Bank Diagnostic Tool</h1>

          {/* Current State */}
          <div className="bg-white dark:bg-vault-gray-800 rounded-xl p-6 mb-6 border border-vault-gray-200 dark:border-vault-gray-700">
            <h2 className="text-xl font-bold mb-4">Current State</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Multi-API Enabled:</span>{' '}
                <span className={isMultiApiEnabled() ? 'text-green-600' : 'text-red-600'}>
                  {isMultiApiEnabled() ? '✅ YES' : '❌ NO'}
                </span>
              </div>
              <div>
                <span className="font-semibold">Enabled APIs:</span> {getEnabledApis().length}
              </div>
              <div>
                <span className="font-semibold">Customer ID:</span> {customerInfo?.id || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Has Session Token:</span>{' '}
                {typeof window !== 'undefined' && sessionStorage.getItem('sessionToken') ? '✅ YES' : '❌ NO'}
              </div>
              <div>
                <span className="font-semibold">Aggregate Providers:</span>{' '}
                {aggregate?.serviceProviders?.length || 0}
              </div>
              <div>
                <span className="font-semibold">Yodlee Banks (Current):</span>{' '}
                {aggregate?.serviceProviders?.filter(p =>
                  p.accountLoginForm?.accountLoginFields && p.accountLoginForm.accountLoginFields.length > 0
                ).length || 0}
              </div>
            </div>
          </div>

          {/* Run Diagnostics Button */}
          <button
            onClick={runDiagnostics}
            disabled={isRunning || loading}
            className="w-full px-6 py-4 bg-vault-green text-white rounded-xl font-bold text-lg hover:bg-vault-green-light transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isRunning ? '🔄 Running Diagnostics...' : '🚀 Run Full Diagnostic'}
          </button>

          {/* Individual API Results */}
          {debugResults.length > 0 && (
            <div className="space-y-4 mb-6">
              <h2 className="text-2xl font-bold">Individual API Results</h2>
              {debugResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-vault-gray-800 rounded-xl p-6 border border-vault-gray-200 dark:border-vault-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{result.apiName}</h3>
                      <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                        {result.apiUrl}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        result.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : result.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {result.status === 'success' ? '✅ SUCCESS' : result.status === 'error' ? '❌ ERROR' : '⏳ LOADING'}
                    </div>
                  </div>

                  {result.status === 'success' && (
                    <div>
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="bg-vault-gray-100 dark:bg-vault-gray-700 p-3 rounded">
                          <div className="text-2xl font-bold">{result.providerCount}</div>
                          <div className="text-xs text-vault-gray-600 dark:text-vault-gray-400">Total</div>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">
                          <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                            {result.yodleeCount}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-300">🇿🇦 Yodlee (SA)</div>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900 p-3 rounded">
                          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                            {result.leanCount}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-300">🇦🇪 Lean (UAE)</div>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded">
                          <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                            {result.vezgoCount}
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-300">Vezgo</div>
                        </div>
                      </div>

                      {/* Sample Providers */}
                      {result.sampleProviders.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-bold mb-2">Sample Providers:</h4>
                          <div className="bg-vault-gray-50 dark:bg-vault-gray-900 p-3 rounded text-xs font-mono">
                            <pre>{JSON.stringify(result.sampleProviders, null, 2)}</pre>
                          </div>
                        </div>
                      )}

                      {/* Raw Response Info */}
                      {result.rawResponse && (
                        <div className="mt-4">
                          <h4 className="text-sm font-bold mb-2">Response Structure:</h4>
                          <div className="bg-vault-gray-50 dark:bg-vault-gray-900 p-3 rounded text-xs font-mono">
                            <pre>{JSON.stringify(result.rawResponse, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {result.status === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                      <p className="text-red-800 dark:text-red-400 text-sm">{result.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Multi-API Aggregation Result */}
          {multiApiResult && (
            <div className="bg-white dark:bg-vault-gray-800 rounded-xl p-6 border-2 border-vault-green">
              <h2 className="text-2xl font-bold mb-4">🌍 Multi-API Aggregation Result</h2>

              {multiApiResult.error ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                  <p className="text-red-800 dark:text-red-400">{multiApiResult.error}</p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-vault-gray-100 dark:bg-vault-gray-700 p-3 rounded">
                      <div className="text-2xl font-bold">{multiApiResult.total}</div>
                      <div className="text-xs">Total Merged</div>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">
                      <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                        {multiApiResult.yodlee}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-300">🇿🇦 Yodlee</div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded">
                      <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                        {multiApiResult.lean}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-300">🇦🇪 Lean</div>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded">
                      <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                        {multiApiResult.vezgo}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-300">Vezgo</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-bold mb-2">Sample Merged Providers:</h4>
                    <div className="bg-vault-gray-50 dark:bg-vault-gray-900 p-3 rounded text-xs font-mono">
                      <pre>{JSON.stringify(multiApiResult.sampleProviders, null, 2)}</pre>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="mt-6 p-4 bg-vault-green/10 border border-vault-green rounded-lg">
                    <h4 className="font-bold text-vault-green mb-2">💡 Status</h4>
                    {multiApiResult.yodlee > 0 ? (
                      <p className="text-sm">
                        ✅ <strong>SUCCESS!</strong> Found {multiApiResult.yodlee} Yodlee banks.
                        They should appear in the link-account page with the "🇿🇦 SA Bank" badge.
                      </p>
                    ) : (
                      <p className="text-sm">
                        ⚠️ <strong>No Yodlee banks detected.</strong> The SA API might not have providers
                        with `accountLoginForm` populated, or authentication is failing.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold mb-2">📋 How to Use This Tool</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Click "Run Full Diagnostic" to test all configured APIs</li>
              <li>Check if "Multi-API Enabled" shows YES (need 2+ APIs configured)</li>
              <li>Look for Yodlee bank counts in each API result</li>
              <li>Check the "Multi-API Aggregation Result" for the final merged list</li>
              <li>If Yodlee banks are found, they should appear on /app/link-account</li>
            </ol>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
