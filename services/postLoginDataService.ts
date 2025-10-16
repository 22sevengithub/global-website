// Post-Login Data Service - 3-Phase Fetch Strategy
// Based on Vault22 Flutter app implementation

import { customerApi, exchangeRateApi } from './api';
import { Aggregate, ExchangeRate } from '../types';
import { fetchProvidersFromAllApis, isMultiApiEnabled } from './multiApiService';

export class PostLoginDataService {
  /**
   * Phase 0: Fetch exchange rates FIRST (CRITICAL!)
   * This MUST happen before any UI with currency conversion is shown
   * Matches Flutter app: app_start_resume_controller.dart line 110
   */
  async fetchExchangeRates(): Promise<ExchangeRate[]> {
    console.log('💱 Phase 0: Fetching exchange rates (CRITICAL)...');

    try {
      const exchangeRateData = await exchangeRateApi.getExchangeRates();

      // Parse response matching Flutter's toDalList() logic
      // Response structure: { fx: { rates: { "USD": "1.0", "ZAR": "18.5" } } }
      // OR direct structure: { rates: { "USD": "1.0" } } when type parameter provided
      let ratesMap: { [key: string]: string } | undefined;
      let ttsId = '';
      let dateString = new Date().toISOString().split('T')[0];

      // Check for nested fx structure
      if (exchangeRateData.fx && exchangeRateData.fx.rates) {
        ratesMap = exchangeRateData.fx.rates;
        ttsId = exchangeRateData.fx.ttsId || '';
        if (exchangeRateData.fx.date) {
          dateString = exchangeRateData.fx.date;
        }
      } else if (exchangeRateData.rates) {
        // Direct rates structure
        ratesMap = exchangeRateData.rates;
        ttsId = exchangeRateData.ttsId || '';
        if (exchangeRateData.date) {
          dateString = exchangeRateData.date;
        }
      }

      // Convert Map<String, String> to ExchangeRate[] array
      const rates: ExchangeRate[] = [];
      if (ratesMap) {
        Object.entries(ratesMap).forEach(([currency, rateStr]) => {
          if (currency && rateStr) {
            rates.push({
              id: `${ttsId}_${currency}_${dateString}`,
              ttsId,
              date: dateString,
              currency: currency.toUpperCase(),
              rate: parseFloat(rateStr),
              fetchedAt: new Date().toISOString()
            });
          }
        });
      }

      // Cache the rates
      if (rates.length > 0) {
        localStorage.setItem('EXCHANGE_RATES', JSON.stringify(rates));
        localStorage.setItem('EXCHANGE_RATES_FETCHED_AT', new Date().toISOString());
        console.log(`✅ Fetched ${rates.length} exchange rates:`, rates.map(r => `${r.currency}=${r.rate}`).join(', '));
      } else {
        console.warn('⚠️ No exchange rates found in response:', exchangeRateData);
      }

      return rates;
    } catch (error) {
      console.warn('⚠️ Failed to fetch exchange rates, using cached:', error);

      // Try to use cached rates
      const cachedRates = localStorage.getItem('EXCHANGE_RATES');
      if (cachedRates) {
        try {
          const parsed = JSON.parse(cachedRates);
          console.log(`📦 Using ${parsed.length} cached exchange rates`);
          return parsed;
        } catch {
          return [];
        }
      }

      return [];
    }
  }

  /**
   * Phase 1: Fetch critical data in parallel for fast initial load (500ms - 1s)
   */
  async fetchCriticalData(customerId: string): Promise<Aggregate> {
    console.log('📊 Phase 1: Fetching critical data...');

    const startTime = Date.now();

    try {
      // CRITICAL: Fetch exchange rates FIRST before any other data
      // This ensures currency conversion will work when data is displayed
      await this.fetchExchangeRates();

      // For now, use the same aggregate endpoint since aggregate-recent doesn't exist
      // In production, this would be: /customer/{customerId}/aggregate-recent
      const lastTimestamp = localStorage.getItem('AGGREGATE_TIMESTAMP') || '';
      const aggregateData = await customerApi.getAggregate(customerId, lastTimestamp, false);

      // Multi-API Mode: Fetch service providers from all enabled APIs
      // Check if multi-API is enabled (2+ APIs configured)
      console.log('');
      console.log('╔' + '═'.repeat(78) + '╗');
      console.log('║' + ' '.repeat(20) + 'MULTI-API MODE CHECK' + ' '.repeat(38) + '║');
      console.log('╚' + '═'.repeat(78) + '╝');
      const isMultiApi = isMultiApiEnabled();
      console.log(`🔍🔍🔍 [PostLogin] Multi-API check result: isMultiApiEnabled=${isMultiApi}`);
      console.log('');

      if (isMultiApi) {
        console.log('✅✅✅ [PostLogin] Multi-API mode is ENABLED! Fetching providers from all APIs...');
        console.log('');

        try {
          console.log(`📞 [PostLogin] Calling fetchProvidersFromAllApis(${customerId})...`);
          const multiApiProviders = await fetchProvidersFromAllApis(customerId);
          console.log(`📥 [PostLogin] fetchProvidersFromAllApis returned ${multiApiProviders.length} providers`);

          if (multiApiProviders && multiApiProviders.length > 0) {
            const originalCount = aggregateData.serviceProviders?.length || 0;
            console.log('');
            console.log('✅✅✅ [PostLogin] MULTI-API SUCCESS!');
            console.log(`   Original provider count: ${originalCount}`);
            console.log(`   Multi-API provider count: ${multiApiProviders.length}`);
            console.log(`   Difference: +${multiApiProviders.length - originalCount} providers`);
            console.log('');
            aggregateData.serviceProviders = multiApiProviders as any;
          } else {
            console.warn('⚠️⚠️⚠️ [PostLogin] Multi-API fetch returned no providers, keeping original');
          }
        } catch (multiApiError) {
          console.error('❌❌❌ [PostLogin] Multi-API fetch FAILED:', multiApiError);
          console.error('   Keeping original providers from primary API');
          // Fall back to original providers from primary API
        }
      } else {
        console.warn('⚠️⚠️⚠️ [PostLogin] Multi-API mode is DISABLED (only 1 API configured)');
        console.log('   This means you will only see providers from the primary API');
        console.log('');
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Phase 1 complete in ${duration}ms`);

      // Save timestamp for delta sync
      if (aggregateData.customerInfo?.updatedAt) {
        const timestamp = new Date(aggregateData.customerInfo.updatedAt).getTime();
        localStorage.setItem('AGGREGATE_TIMESTAMP', timestamp.toString());
      }

      return aggregateData;
    } catch (error) {
      console.error('❌ Phase 1 failed:', error);
      throw error;
    }
  }

  /**
   * Phase 2: Setup real-time connection (SignalR)
   * Matches Flutter: app_start_resume_controller.dart lines 123-125
   */
  async setupRealTimeConnection(): Promise<void> {
    console.log('📡 Phase 2: Real-time connection setup...');

    try {
      const sessionToken = sessionStorage.getItem('sessionToken');
      if (!sessionToken) {
        console.warn('⚠️ No session token found - skipping SignalR setup');
        return;
      }

      const { getSignalRService } = await import('./signalRService');
      const signalRService = getSignalRService();

      // Get or create connection
      await signalRService.getConnection(sessionToken);

      // Subscribe to aggregate updates
      await signalRService.subscribeToAggregate((args) => {
        console.log('📊 Aggregate update received - refreshing data');
        this.handleAggregateUpdate(args);
      });

      // Subscribe to MFA updates
      await signalRService.subscribeToMfa((args) => {
        console.log('🔐 MFA update received');
        this.handleMfaUpdate(args);
      });

      console.log('✅ Phase 2: SignalR connected and subscribed');
    } catch (error) {
      console.error('❌ Phase 2: SignalR setup failed:', error);
      // Don't throw - real-time is not critical for app to work
    }
  }

  /**
   * Handle aggregate update from SignalR
   */
  private handleAggregateUpdate(args?: any[]): void {
    console.log('📊 Handling aggregate update', args);

    // Trigger a delta fetch
    // This will be called by AppContext or a global event listener
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aggregateUpdated', { detail: args }));
    }
  }

  /**
   * Handle MFA update from SignalR
   */
  private handleMfaUpdate(args?: any[]): void {
    console.log('🔐 Handling MFA update', args);

    // Dispatch event for MFA components to listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mfaRequired', { detail: args }));
    }
  }

  /**
   * Phase 3: Fetch complete data in background (non-blocking, 2s - 5s)
   */
  async fetchBackgroundData(customerId: string): Promise<void> {
    console.log('🔄 Phase 3: Background fetch started...');

    try {
      // Run in background - don't await
      Promise.all([
        this.fetchAggregateFull(customerId),
        // this.fetchHistoricalBalances(customerId), // Add when endpoint is available
      ]).then(() => {
        console.log('✅ Phase 3: Background fetch complete');
      }).catch((error) => {
        console.error('❌ Phase 3 failed:', error);
        // Don't throw - this is non-critical
      });
    } catch (error) {
      console.error('❌ Phase 3 error:', error);
      // Don't throw - background fetch failure shouldn't block app
    }
  }

  /**
   * Fetch full aggregate with delta sync
   */
  private async fetchAggregateFull(customerId: string): Promise<Aggregate> {
    const lastTimestamp = localStorage.getItem('AGGREGATE_TIMESTAMP') || '';
    const getDeltas = lastTimestamp !== '';

    console.log(`🔄 Fetching ${getDeltas ? 'delta' : 'full'} aggregate...`);

    const aggregateData = await customerApi.getAggregate(
      customerId,
      lastTimestamp,
      getDeltas
    );

    // Save server timestamp for next delta sync
    if (aggregateData.customerInfo?.updatedAt) {
      const timestamp = new Date(aggregateData.customerInfo.updatedAt).getTime();
      localStorage.setItem('AGGREGATE_TIMESTAMP', timestamp.toString());
    }

    return aggregateData;
  }

  /**
   * Check if we need to fetch full history (35+ days since last update)
   */
  private shouldFetchHistorical(lastUpdate: string): boolean {
    if (!lastUpdate) return true;

    const lastUpdateTime = parseInt(lastUpdate, 10);
    const now = Date.now();
    const daysSinceUpdate = (now - lastUpdateTime) / (1000 * 60 * 60 * 24);

    // If last update was more than 35 days ago, fetch full history
    return daysSinceUpdate > 35;
  }

  /**
   * Execute complete post-login flow (all 3 phases)
   */
  async executePostLoginFlow(customerId: string): Promise<Aggregate> {
    try {
      // Phase 1: Critical data (blocking - user waits for this)
      const aggregateData = await this.fetchCriticalData(customerId);

      // Phase 2: Real-time setup (blocking but fast)
      await this.setupRealTimeConnection();

      // Phase 3: Background fetch (non-blocking - runs after user sees data)
      this.fetchBackgroundData(customerId);

      console.log('✅ Post-login flow complete');

      return aggregateData;
    } catch (error) {
      console.error('❌ Post-login flow failed:', error);
      throw error;
    }
  }
}

export const postLoginDataService = new PostLoginDataService();
