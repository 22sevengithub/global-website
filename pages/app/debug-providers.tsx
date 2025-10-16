import { useApp } from '../../contexts/AppContext';
import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DebugProviders() {
  const { aggregate, customerId } = useApp();

  const providers = aggregate?.serviceProviders || [];

  // Count by type
  const providersByType = providers.reduce((acc, p: any) => {
    let type = 'UNKNOWN';
    if (p.integrationProvider === 'LEAN') {
      type = 'LEAN';
    } else if (p.integrationProvider === 'VEZGO') {
      type = 'VEZGO';
    } else if (p.accountLoginForm?.accountLoginFields && p.accountLoginForm.accountLoginFields.length > 0) {
      type = 'YODLEE';
    }
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count by source API
  const providersBySource = providers.reduce((acc, p: any) => {
    const source = p.sourceApi || 'No sourceApi property';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ProtectedRoute>
      <AppShell title="Debug Providers | Vault22">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-red-900 mb-2">
              🔍 PROVIDER DEBUG PAGE
            </h1>
            <p className="text-red-700">
              This page shows EXACTLY what's in your aggregate data
            </p>
          </div>

          {/* Customer ID */}
          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">Customer ID</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {customerId || 'NOT LOGGED IN'}
            </pre>
          </div>

          {/* Aggregate Status */}
          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">Aggregate Status</h2>
            <div className="space-y-2">
              <div>
                <strong>Aggregate exists:</strong> {aggregate ? '✅ YES' : '❌ NO'}
              </div>
              <div>
                <strong>Has serviceProviders:</strong> {aggregate?.serviceProviders ? '✅ YES' : '❌ NO'}
              </div>
              <div>
                <strong>Provider count:</strong> {providers.length}
              </div>
            </div>
          </div>

          {/* Provider Counts */}
          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-2 text-green-700">
              📊 Provider Counts by Type
            </h2>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify(providersByType, null, 2)}
            </pre>
            {providersByType.YODLEE ? (
              <div className="mt-3 p-3 bg-green-100 border border-green-500 rounded">
                <strong className="text-green-900">✅ YODLEE BANKS FOUND: {providersByType.YODLEE}</strong>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-red-100 border border-red-500 rounded">
                <strong className="text-red-900">❌ NO YODLEE BANKS - MULTI-API DIDN'T WORK!</strong>
              </div>
            )}
          </div>

          {/* Provider Counts by Source API */}
          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-2 text-blue-700">
              🌍 Provider Counts by Source API
            </h2>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify(providersBySource, null, 2)}
            </pre>
            {providersBySource['SA Production'] ? (
              <div className="mt-3 p-3 bg-green-100 border border-green-500 rounded">
                <strong className="text-green-900">
                  ✅ SA PRODUCTION API WORKING: {providersBySource['SA Production']} providers
                </strong>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-yellow-100 border border-yellow-500 rounded">
                <strong className="text-yellow-900">
                  ⚠️ NO 'SA Production' SOURCE - Multi-API may not have run
                </strong>
              </div>
            )}
          </div>

          {/* Sample Providers */}
          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">Sample Providers (First 10)</h2>
            <div className="space-y-2">
              {providers.slice(0, 10).map((p: any, i: number) => {
                let type = 'UNKNOWN';
                if (p.integrationProvider === 'LEAN') type = 'LEAN';
                else if (p.integrationProvider === 'VEZGO') type = 'VEZGO';
                else if (p.accountLoginForm?.accountLoginFields) type = 'YODLEE';

                return (
                  <div key={i} className="p-3 bg-gray-50 rounded border">
                    <div><strong>Name:</strong> {p.name}</div>
                    <div><strong>Type:</strong> {type}</div>
                    <div><strong>Source API:</strong> {p.sourceApi || '❌ NO sourceApi property'}</div>
                    <div><strong>Has apiBaseUrl:</strong> {p.apiBaseUrl ? '✅ YES' : '❌ NO'}</div>
                    <div><strong>Has encryptionKey:</strong> {p.encryptionKey ? '✅ YES' : '❌ NO'}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Provider Names */}
          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">All Provider Names ({providers.length})</h2>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {providers.map((p: any, i: number) => {
                  let type = 'UNKNOWN';
                  if (p.integrationProvider === 'LEAN') type = '🇦🇪 LEAN';
                  else if (p.integrationProvider === 'VEZGO') type = '💰 VEZGO';
                  else if (p.accountLoginForm?.accountLoginFields) type = '🇿🇦 YODLEE';

                  return (
                    <div key={i} className="text-sm p-2 bg-gray-50 rounded border">
                      {p.name} <span className="text-xs text-gray-500">({type})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Full Aggregate JSON */}
          <div className="bg-white border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Full Aggregate JSON</h2>
            <div className="max-h-96 overflow-y-auto">
              <pre className="bg-gray-100 p-3 rounded text-xs">
                {JSON.stringify({
                  hasAggregate: !!aggregate,
                  providerCount: providers.length,
                  sampleProvider: providers[0] || null,
                }, null, 2)}
              </pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-yellow-900 mb-3">
              📋 What To Check
            </h2>
            <ul className="list-disc list-inside space-y-2 text-yellow-900">
              <li><strong>Provider count:</strong> Should be 80-100 (not 10-15)</li>
              <li><strong>YODLEE count:</strong> Should be 60-80 (SA banks)</li>
              <li><strong>Source API:</strong> Should show "Global/UAE" and "SA Production"</li>
              <li><strong>Sample providers:</strong> Should have sourceApi, apiBaseUrl, encryptionKey properties</li>
            </ul>
            <div className="mt-4 p-3 bg-white border border-yellow-500 rounded">
              <strong>If you DON'T see SA Production providers:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Open browser console (F12)</li>
                <li>Look for the multi-API logs</li>
                <li>Check if you see "Multi-API mode is ENABLED"</li>
                <li>Check if you see "Fetched 72 providers from SA Production"</li>
              </ol>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
