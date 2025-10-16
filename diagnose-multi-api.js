// ULTRA-DIAGNOSTIC: Multi-API Debugging Script
// Copy and paste this ENTIRE script into browser console (F12) AFTER logging in

(async function ultraDiagnose() {
  console.clear();
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + 'ULTRA-DIAGNOSTIC: Multi-API' + ' '.repeat(29) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('');

  // ============================================================================
  // STEP 1: Check Login Status
  // ============================================================================
  console.log('═'.repeat(80));
  console.log('STEP 1: CHECK LOGIN STATUS');
  console.log('═'.repeat(80));
  console.log('');

  const customerId = sessionStorage.getItem('customerId');
  const sessionToken = sessionStorage.getItem('sessionToken');
  const requestToken = sessionStorage.getItem('requestToken');

  console.log('📋 Session Storage:');
  console.log('   customerId:', customerId || '❌ MISSING');
  console.log('   sessionToken:', sessionToken ? '✅ EXISTS (' + sessionToken.substring(0, 20) + '...)' : '❌ MISSING');
  console.log('   requestToken:', requestToken ? '✅ EXISTS (' + requestToken.substring(0, 20) + '...)' : '❌ MISSING');
  console.log('');

  if (!customerId || !sessionToken || !requestToken) {
    console.error('❌❌❌ CRITICAL: NOT LOGGED IN!');
    console.log('');
    console.log('You must login first:');
    console.log('1. Go to: http://localhost:3000/login');
    console.log('2. Login with your credentials');
    console.log('3. Wait for login to complete');
    console.log('4. Come back and run this script again');
    console.log('');
    return;
  }

  console.log('✅ Login tokens present');
  console.log('');

  // ============================================================================
  // STEP 2: Test Global/UAE API
  // ============================================================================
  console.log('═'.repeat(80));
  console.log('STEP 2: TEST GLOBAL/UAE API');
  console.log('═'.repeat(80));
  console.log('');

  const globalApiUrl = 'https://api-global.dev.vault22.io';
  console.log('🌍 Testing:', globalApiUrl);
  console.log('   Endpoint:', `/customer/${customerId}/aggregate`);
  console.log('');

  let globalProviders = [];
  try {
    const globalResponse = await fetch(`${globalApiUrl}/customer/${customerId}/aggregate?updatedSince=0&getDeltas=false`, {
      headers: {
        'X-SESSION-TOKEN': sessionToken,
        'X-REQUEST-TOKEN': requestToken,
        'Content-Type': 'application/json',
      }
    });

    console.log('   Status:', globalResponse.status, globalResponse.statusText);

    if (globalResponse.ok) {
      const globalData = await globalResponse.json();
      globalProviders = globalData.serviceProviders || [];

      console.log('   ✅ SUCCESS!');
      console.log('   Provider count:', globalProviders.length);
      console.log('');
      console.log('   Provider breakdown:');

      const byType = globalProviders.reduce((acc, p) => {
        let type = 'UNKNOWN';
        if (p.integrationProvider === 'LEAN') type = 'LEAN';
        else if (p.integrationProvider === 'VEZGO') type = 'VEZGO';
        else if (p.accountLoginForm?.accountLoginFields) type = 'YODLEE';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      console.log('   ', JSON.stringify(byType, null, 2));
      console.log('');

      if (byType.YODLEE && byType.YODLEE > 0) {
        console.log('   🎉 YODLEE banks found in Global API!');
        console.log('   This means Global API has BOTH UAE and SA banks!');
        console.log('   You DON\'T need multi-API mode!');
        console.log('');
      }
    } else {
      const errorText = await globalResponse.text();
      console.error('   ❌ FAILED:', globalResponse.status, globalResponse.statusText);
      console.log('   Response:', errorText.substring(0, 200));
      console.log('');
    }
  } catch (error) {
    console.error('   ❌ ERROR:', error.message);
    console.log('');
  }

  // ============================================================================
  // STEP 3: Test SA Development API
  // ============================================================================
  console.log('═'.repeat(80));
  console.log('STEP 3: TEST SA DEVELOPMENT API');
  console.log('═'.repeat(80));
  console.log('');

  const saApiUrl = 'https://api.develop.my227.net';
  console.log('🇿🇦 Testing:', saApiUrl);
  console.log('   Endpoint:', `/customer/${customerId}/aggregate`);
  console.log('');

  let saProviders = [];
  let saApiWorks = false;

  // Strategy 1: Authenticated fetch
  try {
    console.log('   Trying: Authenticated fetch with UAE tokens...');
    const saResponse = await fetch(`${saApiUrl}/customer/${customerId}/aggregate?updatedSince=0&getDeltas=false`, {
      headers: {
        'X-SESSION-TOKEN': sessionToken,
        'X-REQUEST-TOKEN': requestToken,
        'Content-Type': 'application/json',
      }
    });

    console.log('   Status:', saResponse.status, saResponse.statusText);

    if (saResponse.ok) {
      const saData = await saResponse.json();
      saProviders = saData.serviceProviders || [];
      saApiWorks = true;

      console.log('   ✅ SUCCESS WITH UAE TOKENS!');
      console.log('   Provider count:', saProviders.length);
      console.log('');
      console.log('   Provider breakdown:');

      const byType = saProviders.reduce((acc, p) => {
        let type = 'UNKNOWN';
        if (p.integrationProvider === 'LEAN') type = 'LEAN';
        else if (p.integrationProvider === 'VEZGO') type = 'VEZGO';
        else if (p.accountLoginForm?.accountLoginFields) type = 'YODLEE';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      console.log('   ', JSON.stringify(byType, null, 2));
      console.log('');

      if (byType.YODLEE && byType.YODLEE > 0) {
        console.log('   🎉🎉🎉 YODLEE banks found in SA Development API!');
        console.log('   Multi-API SHOULD work!');
        console.log('');
      } else {
        console.log('   ⚠️ No YODLEE banks in SA Development API');
        console.log('   Either:');
        console.log('   1. SA Development API has same providers as Global API');
        console.log('   2. This customer account doesn\'t have access to SA banks');
        console.log('');
      }
    } else if (saResponse.status === 401 || saResponse.status === 403) {
      console.error('   ❌ AUTHENTICATION FAILED');
      console.log('   This means:');
      console.log('   1. UAE Global API tokens don\'t work on SA Development API');
      console.log('   2. Customer account doesn\'t exist on SA Development API');
      console.log('   3. Different authentication required');
      console.log('');
      console.log('   Response:', await saResponse.text().then(t => t.substring(0, 200)));
      console.log('');
    } else {
      const errorText = await saResponse.text();
      console.error('   ❌ FAILED:', saResponse.status, saResponse.statusText);
      console.log('   Response:', errorText.substring(0, 200));
      console.log('');
    }
  } catch (error) {
    console.error('   ❌ ERROR:', error.message);
    console.log('');
  }

  // Strategy 2: Try public endpoints
  if (!saApiWorks) {
    console.log('   Trying: Public /service-providers endpoint...');
    try {
      const publicResponse = await fetch(`${saApiUrl}/service-providers`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('   Status:', publicResponse.status, publicResponse.statusText);

      if (publicResponse.ok) {
        const publicData = await publicResponse.json();
        saProviders = publicData.serviceProviders || [];
        saApiWorks = true;

        console.log('   ✅ PUBLIC ENDPOINT WORKS!');
        console.log('   Provider count:', saProviders.length);
        console.log('');
      } else {
        console.error('   ❌ Public endpoint failed:', publicResponse.status);
        console.log('');
      }
    } catch (error) {
      console.error('   ❌ Public endpoint error:', error.message);
      console.log('');
    }
  }

  // ============================================================================
  // STEP 4: Test Multi-API Service Directly
  // ============================================================================
  console.log('═'.repeat(80));
  console.log('STEP 4: TEST MULTI-API SERVICE');
  console.log('═'.repeat(80));
  console.log('');

  try {
    console.log('   Loading multiApiService module...');
    const multiApiModule = await import('/services/multiApiService.ts');
    console.log('   ✅ Module loaded');
    console.log('');

    // Check if multi-API is enabled
    if (multiApiModule.isMultiApiEnabled) {
      const isEnabled = multiApiModule.isMultiApiEnabled();
      console.log('   isMultiApiEnabled():', isEnabled ? '✅ TRUE' : '❌ FALSE');
      console.log('');
    }

    // Try fetching from all APIs
    if (multiApiModule.fetchProvidersFromAllApis) {
      console.log('   Calling fetchProvidersFromAllApis()...');
      console.log('   (Check console above for detailed multi-API logs)');
      console.log('');

      const allProviders = await multiApiModule.fetchProvidersFromAllApis(customerId);

      console.log('   ✅ fetchProvidersFromAllApis() completed');
      console.log('   Total providers returned:', allProviders.length);
      console.log('');

      const byType = allProviders.reduce((acc, p) => {
        let type = 'UNKNOWN';
        if (p.integrationProvider === 'LEAN') type = 'LEAN';
        else if (p.integrationProvider === 'VEZGO') type = 'VEZGO';
        else if (p.accountLoginForm?.accountLoginFields) type = 'YODLEE';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const bySource = allProviders.reduce((acc, p) => {
        acc[p.sourceApi || 'unknown'] = (acc[p.sourceApi || 'unknown'] || 0) + 1;
        return acc;
      }, {});

      console.log('   By Type:', JSON.stringify(byType, null, 2));
      console.log('   By Source:', JSON.stringify(bySource, null, 2));
      console.log('');

      if (byType.YODLEE && byType.YODLEE > 0) {
        console.log('   🎉🎉🎉 YODLEE banks found!');
        console.log('   Multi-API service IS working!');
        console.log('');
        console.log('   ⚠️ BUT the problem is: AppContext is NOT using multi-API fetch');
        console.log('');
      } else {
        console.log('   ❌ NO YODLEE banks returned');
        console.log('   Multi-API fetch ran but found no SA banks');
        console.log('');
      }
    }
  } catch (error) {
    console.error('   ❌ Failed to load multiApiService:', error.message);
    console.log('   Error details:', error);
    console.log('');
  }

  // ============================================================================
  // FINAL DIAGNOSIS
  // ============================================================================
  console.log('═'.repeat(80));
  console.log('FINAL DIAGNOSIS');
  console.log('═'.repeat(80));
  console.log('');

  console.log('📊 Summary:');
  console.log('   Global/UAE API providers:', globalProviders.length);
  console.log('   SA Development API providers:', saProviders.length);
  console.log('');

  // Determine the issue
  if (globalProviders.length > 0 && saProviders.length === 0) {
    console.log('❌ ISSUE: SA Development API not accessible or returns no data');
    console.log('');
    console.log('🔧 SOLUTIONS:');
    console.log('');
    console.log('Option 1: Check if Global API already has ALL banks');
    console.log('   If Global API has YODLEE banks, you don\'t need multi-API!');
    console.log('   Just use: NEXT_PUBLIC_API_URL=https://api-global.dev.vault22.io');
    console.log('   And disable multi-API mode');
    console.log('');
    console.log('Option 2: Create account on SA Development API');
    console.log('   Your current customer account only exists on Global API');
    console.log('   You may need to register separately on api.develop.my227.net');
    console.log('');
    console.log('Option 3: Contact backend team');
    console.log('   Ask: "Can UAE Global API credentials work on SA Development API?"');
    console.log('   Ask: "Does SA Development API require separate registration?"');
    console.log('');
  } else if (globalProviders.length > 0 && saProviders.length > 0) {
    console.log('✅ BOTH APIs ARE WORKING!');
    console.log('');

    // Check if they have different providers
    const globalYodlee = globalProviders.filter(p => p.accountLoginForm?.accountLoginFields).length;
    const saYodlee = saProviders.filter(p => p.accountLoginForm?.accountLoginFields).length;

    if (globalYodlee > 0) {
      console.log('🎉 Global API ALREADY has YODLEE banks!');
      console.log('   You DON\'T need multi-API mode!');
      console.log('');
      console.log('🔧 SOLUTION: Simplify to single-API');
      console.log('   Set: NEXT_PUBLIC_API_URL=https://api-global.dev.vault22.io');
      console.log('   Remove: NEXT_PUBLIC_SA_API_URL');
      console.log('   Set: NEXT_PUBLIC_MULTI_API_ENABLED=false');
      console.log('');
    } else if (saYodlee > 0) {
      console.log('🎉 Multi-API IS working!');
      console.log('   SA Development API has', saYodlee, 'YODLEE banks');
      console.log('');
      console.log('❓ BUT why aren\'t they showing in your app?');
      console.log('');
      console.log('🔧 SOLUTION: Check postLoginDataService integration');
      console.log('   1. Make sure you RESTARTED dev server after .env.local changes');
      console.log('   2. Make sure you CLEARED browser storage and re-logged in');
      console.log('   3. Check browser console for multi-API logs during login');
      console.log('   4. Go to /app/debug-providers to see what aggregate has');
      console.log('');
    }
  } else {
    console.log('❌ NEITHER API IS WORKING!');
    console.log('   This is a critical authentication or configuration issue');
    console.log('');
    console.log('🔧 SOLUTIONS:');
    console.log('   1. Check if you\'re actually logged in');
    console.log('   2. Try logging out and logging in again');
    console.log('   3. Check if API endpoints are correct');
    console.log('   4. Check if dev server is running');
    console.log('');
  }

  console.log('═'.repeat(80));
  console.log('DIAGNOSTIC COMPLETE');
  console.log('═'.repeat(80));
  console.log('');
  console.log('📋 Copy the results above and share with your team or Claude');
  console.log('');
})();
