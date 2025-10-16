// Copy and paste this into your browser console (F12) AFTER logging in
// This will test the multi-API fetch directly

(async function testMultiApi() {
  console.log('');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(25) + 'MULTI-API TEST SCRIPT' + ' '.repeat(32) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('');

  // Step 1: Check session tokens
  const sessionToken = sessionStorage.getItem('sessionToken');
  const requestToken = sessionStorage.getItem('requestToken');
  const customerId = sessionStorage.getItem('customerId');

  console.log('📋 Step 1: Check Session Tokens');
  console.log('   Session Token:', sessionToken ? '✅ EXISTS' : '❌ MISSING');
  console.log('   Request Token:', requestToken ? '✅ EXISTS' : '❌ MISSING');
  console.log('   Customer ID:', customerId || '❌ MISSING');
  console.log('');

  if (!customerId) {
    console.error('❌ CRITICAL: No customer ID - you must be logged in!');
    console.log('   Go to http://localhost:3000/login and login first');
    return;
  }

  // Step 2: Test API configurations
  console.log('📋 Step 2: Check API Configurations');

  const globalApiUrl = 'https://api-global.dev.vault22.io';
  const saApiUrl = 'https://api.22seven.com';

  console.log('   Global API URL:', globalApiUrl);
  console.log('   SA API URL:', saApiUrl);
  console.log('');

  // Step 3: Test fetch from Global API
  console.log('📋 Step 3: Test Fetch from Global API');
  try {
    const globalResponse = await fetch(`${globalApiUrl}/customer/${customerId}/aggregate`, {
      headers: {
        'X-SESSION-TOKEN': sessionToken,
        'X-REQUEST-TOKEN': requestToken,
        'Content-Type': 'application/json',
      }
    });

    if (globalResponse.ok) {
      const globalData = await globalResponse.json();
      const globalProviders = globalData.serviceProviders || [];
      console.log('   ✅ Global API Success!');
      console.log('   Provider count:', globalProviders.length);
      console.log('   Sample providers:', globalProviders.slice(0, 3).map(p => p.name));
    } else {
      console.error('   ❌ Global API Failed:', globalResponse.status, globalResponse.statusText);
    }
  } catch (error) {
    console.error('   ❌ Global API Error:', error.message);
  }
  console.log('');

  // Step 4: Test fetch from SA API (authenticated)
  console.log('📋 Step 4: Test Fetch from SA API (Authenticated)');
  try {
    const saResponse = await fetch(`${saApiUrl}/customer/${customerId}/aggregate`, {
      headers: {
        'X-SESSION-TOKEN': sessionToken,
        'X-REQUEST-TOKEN': requestToken,
        'Content-Type': 'application/json',
      }
    });

    if (saResponse.ok) {
      const saData = await saResponse.json();
      const saProviders = saData.serviceProviders || [];
      console.log('   ✅ SA API Authenticated Success!');
      console.log('   Provider count:', saProviders.length);
      console.log('   Sample providers:', saProviders.slice(0, 3).map(p => p.name));
    } else {
      console.warn('   ⚠️ SA API Authenticated Failed:', saResponse.status, saResponse.statusText);
      console.log('   This is expected - will try public endpoint...');
    }
  } catch (error) {
    console.warn('   ⚠️ SA API Authenticated Error:', error.message);
  }
  console.log('');

  // Step 5: Test fetch from SA API (public)
  console.log('📋 Step 5: Test Fetch from SA API (Public Endpoint)');
  try {
    const saPublicResponse = await fetch(`${saApiUrl}/service-providers`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (saPublicResponse.ok) {
      const saPublicData = await saPublicResponse.json();
      const saProviders = saPublicData.serviceProviders || [];
      console.log('   ✅ SA API Public Success!');
      console.log('   Provider count:', saProviders.length);
      console.log('   Sample providers:', saProviders.slice(0, 5).map(p => p.name));
      console.log('');
      console.log('   🎉🎉🎉 SUCCESS! SA API IS ACCESSIBLE!');
      console.log('   This means multi-API SHOULD work!');
    } else {
      console.error('   ❌ SA API Public Failed:', saPublicResponse.status, saPublicResponse.statusText);
    }
  } catch (error) {
    console.error('   ❌ SA API Public Error:', error.message);
    console.log('   This might be a CORS issue');
  }
  console.log('');

  // Step 6: Check if multi-API service exists
  console.log('📋 Step 6: Check Multi-API Service');
  try {
    // Try to import the service
    const multiApiModule = await import('/services/multiApiService.ts');
    console.log('   ✅ multiApiService module loaded');

    if (multiApiModule.isMultiApiEnabled) {
      const isEnabled = multiApiModule.isMultiApiEnabled();
      console.log('   isMultiApiEnabled():', isEnabled ? '✅ TRUE' : '❌ FALSE');
    } else {
      console.error('   ❌ isMultiApiEnabled function not found');
    }

    if (multiApiModule.fetchProvidersFromAllApis) {
      console.log('   ✅ fetchProvidersFromAllApis function exists');

      console.log('');
      console.log('📋 Step 7: Test Multi-API Fetch Directly');
      console.log('   Calling fetchProvidersFromAllApis...');

      const allProviders = await multiApiModule.fetchProvidersFromAllApis(customerId);
      console.log('   ✅ Multi-API fetch completed!');
      console.log('   Total providers:', allProviders.length);

      const byType = allProviders.reduce((acc, p) => {
        let type = 'UNKNOWN';
        if (p.integrationProvider === 'LEAN') type = 'LEAN';
        else if (p.integrationProvider === 'VEZGO') type = 'VEZGO';
        else if (p.accountLoginForm?.accountLoginFields) type = 'YODLEE';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const bySource = allProviders.reduce((acc, p) => {
        acc[p.sourceApi || 'no-source'] = (acc[p.sourceApi || 'no-source'] || 0) + 1;
        return acc;
      }, {});

      console.log('   By Type:', byType);
      console.log('   By Source:', bySource);

      if (byType.YODLEE > 0) {
        console.log('');
        console.log('   🎉🎉🎉 YODLEE BANKS FOUND! Multi-API IS WORKING!');
        console.log('   The problem is that AppContext is not using the multi-API fetch');
      } else {
        console.error('');
        console.error('   ❌ NO YODLEE BANKS - Multi-API fetch failed');
      }
    } else {
      console.error('   ❌ fetchProvidersFromAllApis function not found');
    }
  } catch (error) {
    console.error('   ❌ Failed to load multiApiService:', error.message);
    console.log('   Error details:', error);
  }

  console.log('');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(30) + 'TEST COMPLETE' + ' '.repeat(36) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('');
  console.log('📊 SUMMARY:');
  console.log('   1. If SA API public endpoint worked → Multi-API CAN work');
  console.log('   2. If multi-API fetch returned YODLEE banks → Service works');
  console.log('   3. If you still don\'t see banks → AppContext not calling multi-API');
  console.log('');
  console.log('📋 NEXT STEP: Copy the results above and send to Claude');
})();
