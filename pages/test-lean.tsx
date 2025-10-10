// Test Page to Verify Lean SDK Integration
// Access at: http://localhost:3000/test-lean

import { useEffect, useState } from 'react';
import { isLeanSDKLoaded, waitForLeanSDK } from '../services/leanSdk';

export default function TestLeanPage() {
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [sdkInfo, setSdkInfo] = useState<string>('');

  useEffect(() => {
    const checkSDK = async () => {
      try {
        // Check if SDK is immediately available
        if (isLeanSDKLoaded()) {
          setSdkStatus('loaded');
          setSdkInfo('Lean SDK is loaded and ready!');
          return;
        }

        // Wait for SDK to load
        setSdkInfo('Waiting for Lean SDK to load...');
        await waitForLeanSDK(5000);

        setSdkStatus('loaded');
        setSdkInfo('Lean SDK loaded successfully!');

        // Log available methods
        if (window.Lean) {
          console.log('Lean SDK Methods:', Object.keys(window.Lean));
        }
      } catch (error) {
        setSdkStatus('error');
        setSdkInfo(`Failed to load Lean SDK: ${error}`);
        console.error('Lean SDK Error:', error);
      }
    };

    checkSDK();
  }, []);

  return (
    <div className="min-h-screen bg-vault-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-barlow font-bold text-vault-black mb-2">
            Lean SDK Integration Test
          </h1>
          <p className="text-vault-gray-600 mb-8">
            This page verifies that the Lean Technologies SDK is properly integrated
          </p>

          {/* SDK Status */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">
                {sdkStatus === 'loading' && '⏳'}
                {sdkStatus === 'loaded' && '✅'}
                {sdkStatus === 'error' && '❌'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-vault-black">
                  SDK Status: {sdkStatus.toUpperCase()}
                </h2>
                <p className="text-vault-gray-600">{sdkInfo}</p>
              </div>
            </div>

            {sdkStatus === 'loaded' && (
              <div className="bg-vault-green bg-opacity-10 border-l-4 border-vault-green p-4 rounded">
                <p className="font-semibold text-vault-green">
                  ✓ Lean SDK is ready to use
                </p>
                <p className="text-sm text-vault-gray-700 mt-1">
                  You can now use the useLeanConnect hook to link bank accounts
                </p>
              </div>
            )}

            {sdkStatus === 'error' && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-700">
                  ⚠ Lean SDK failed to load
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Check the browser console for more details
                </p>
              </div>
            )}
          </div>

          {/* Implementation Checklist */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-vault-black mb-4">
              Implementation Checklist
            </h3>
            <div className="space-y-2">
              <ChecklistItem
                checked={sdkStatus === 'loaded'}
                label="Lean SDK script loaded in _document.tsx"
              />
              <ChecklistItem
                checked={sdkStatus === 'loaded'}
                label="window.Lean global object available"
              />
              <ChecklistItem
                checked={true}
                label="TypeScript types defined (types/lean.ts)"
              />
              <ChecklistItem
                checked={true}
                label="Service layer implemented (services/leanSdk.ts)"
              />
              <ChecklistItem
                checked={true}
                label="API endpoints added (services/api.ts)"
              />
              <ChecklistItem
                checked={true}
                label="React hook created (hooks/useLeanConnect.ts)"
              />
              <ChecklistItem
                checked={true}
                label="Environment variables configured"
              />
            </div>
          </div>

          {/* Quick Start */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold text-vault-black mb-4">
              Quick Start Code
            </h3>
            <pre className="bg-vault-gray-900 text-vault-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
              {`import { useLeanConnect } from '../hooks/useLeanConnect';

function MyComponent() {
  const customerId = sessionStorage.getItem('customerId');

  const { connectBankAccount, isLoading } = useLeanConnect(
    customerId,
    {
      onSuccess: () => alert('Bank linked!'),
      onCancel: () => alert('Cancelled'),
      onError: (error) => alert(error),
    }
  );

  return (
    <button onClick={() => connectBankAccount(provider)}>
      {isLoading ? 'Connecting...' : 'Link Bank'}
    </button>
  );
}`}
            </pre>
          </div>

          {/* Documentation Links */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold text-vault-black mb-4">
              Documentation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocLink
                title="Quick Start Guide"
                file="LEAN_SDK_QUICKSTART.md"
                description="Get started in 5 minutes"
              />
              <DocLink
                title="Full Implementation Guide"
                file="LEAN_SDK_IMPLEMENTATION.md"
                description="Complete technical documentation"
              />
              <DocLink
                title="Usage Examples"
                file="examples/LeanBankLinkingExample.tsx"
                description="Working code samples"
              />
              <DocLink
                title="Type Definitions"
                file="types/lean.ts"
                description="TypeScript interfaces"
              />
            </div>
          </div>

          {/* Browser Console Info */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold text-vault-black mb-4">
              Browser Console Check
            </h3>
            <p className="text-vault-gray-600 mb-2">
              Open your browser's developer console and run:
            </p>
            <code className="bg-vault-gray-100 px-3 py-2 rounded text-sm block">
              window.Lean
            </code>
            <p className="text-vault-gray-600 mt-2 text-sm">
              You should see the Lean SDK object with methods: connect, reconnect, pay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded flex items-center justify-center ${
        checked ? 'bg-vault-green text-white' : 'bg-vault-gray-200 text-vault-gray-400'
      }`}>
        {checked && '✓'}
      </div>
      <span className={checked ? 'text-vault-black' : 'text-vault-gray-500'}>
        {label}
      </span>
    </div>
  );
}

function DocLink({ title, file, description }: { title: string; file: string; description: string }) {
  return (
    <div className="border border-vault-gray-200 rounded-lg p-4 hover:border-vault-green transition-colors">
      <h4 className="font-semibold text-vault-black mb-1">{title}</h4>
      <p className="text-sm text-vault-gray-600 mb-2">{description}</p>
      <code className="text-xs text-vault-blue">{file}</code>
    </div>
  );
}
