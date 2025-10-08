import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { authApi } from '../services/api';

export default function TestLogin() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Test if context is available
  let contextAvailable = false;
  let contextError = '';

  try {
    const { isAuthenticated } = useApp();
    contextAvailable = true;
  } catch (err: any) {
    contextError = err.message;
  }

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing...');

    try {
      console.log('[TEST] Starting login test...');
      console.log('[TEST] API URL:', process.env.NEXT_PUBLIC_API_URL);

      const response = await authApi.login('demo@vault22.com', 'Demo123!@#');

      console.log('[TEST] Response:', response);
      setResult(JSON.stringify(response, null, 2));
    } catch (err: any) {
      console.error('[TEST] Error:', err);
      console.error('[TEST] Error response:', err.response);
      console.error('[TEST] Error data:', err.response?.data);

      setResult(`ERROR: ${err.message}\n\nResponse: ${JSON.stringify(err.response?.data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Login Test Page</h1>

      <div style={{ marginBottom: '20px', padding: '10px', background: contextAvailable ? '#d4edda' : '#f8d7da', border: '1px solid', borderColor: contextAvailable ? '#c3e6cb' : '#f5c6cb', borderRadius: '4px' }}>
        <strong>Context Status:</strong> {contextAvailable ? '✅ Available' : '❌ Not Available'}
        {!contextAvailable && <div>Error: {contextError}</div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
      </div>

      <button
        onClick={testLogin}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        {loading ? 'Testing...' : 'Test Login API'}
      </button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Result:</h3>
          <pre style={{
            background: '#f4f4f4',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {result}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Check if context is available (should be green)</li>
          <li>Click "Test Login API" button</li>
          <li>Open browser console (F12) to see detailed logs</li>
          <li>Check the result below</li>
        </ol>
      </div>
    </div>
  );
}
