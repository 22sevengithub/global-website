// SignalR Real-Time Service
// Matches Flutter: core/services/signalr_service.dart

import * as signalR from '@microsoft/signalr';

const SIGNALR_URL = process.env.NEXT_PUBLIC_SIGNALR_URL || 'https://steph.develop.my227.net';

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private sessionToken: string | null = null;

  /**
   * Get or create SignalR connection
   * Matches Flutter: SignalRService.getConnection()
   */
  async getConnection(sessionToken: string): Promise<signalR.HubConnection> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      return this.connection;
    }

    this.sessionToken = sessionToken;

    // Build connection URL with session token
    const hubUrl = `${SIGNALR_URL}/hub/dataChanged?sessionToken=${sessionToken}`;

    console.log('🔌 SignalR: Connecting to', hubUrl);

    // Create connection with automatic reconnection
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        timeout: 10000,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up event handlers
    this.connection.onclose((error) => {
      console.log('🔌 SignalR: Connection closed', error);
    });

    this.connection.onreconnecting((error) => {
      console.log('🔌 SignalR: Reconnecting...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('🔌 SignalR: Reconnected', connectionId);
    });

    // Start connection if not already connected
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      await this.connection.start();
      console.log('✅ SignalR: Connected. State:', this.connection.state);
    }

    return this.connection;
  }

  /**
   * Subscribe to aggregate updates
   * Matches Flutter: aggregateService.subscribeToAggregate()
   */
  async subscribeToAggregate(callback: (args?: any[]) => void): Promise<void> {
    if (!this.sessionToken) {
      throw new Error('Session token not set. Call getConnection first.');
    }

    const connection = await this.getConnection(this.sessionToken);

    console.log('📊 SignalR: Subscribing to AggregateUpdated');

    // Register handler for aggregate updates
    connection.on('AggregateUpdated', (args) => {
      console.log('📊 SignalR: Aggregate updated', args);
      callback(args);
    });
  }

  /**
   * Subscribe to MFA/OTP notifications
   * Matches Flutter: mfaService.subscribeToMfa()
   */
  async subscribeToMfa(callback: (args?: any[]) => void): Promise<void> {
    if (!this.sessionToken) {
      throw new Error('Session token not set. Call getConnection first.');
    }

    const connection = await this.getConnection(this.sessionToken);

    console.log('🔐 SignalR: Subscribing to MFA updates');

    // Register handler for MFA updates
    connection.on('MfaRequired', (args) => {
      console.log('🔐 SignalR: MFA required', args);
      callback(args);
    });

    connection.on('OtpSent', (args) => {
      console.log('🔐 SignalR: OTP sent', args);
      callback(args);
    });
  }

  /**
   * Unsubscribe from all updates and disconnect
   * Matches Flutter: aggregateService.unsubscribeFromAggregate()
   */
  async unsubscribe(): Promise<void> {
    if (!this.connection) {
      return;
    }

    console.log('🔌 SignalR: Unsubscribing and disconnecting');

    // Remove all handlers
    this.connection.off('AggregateUpdated');
    this.connection.off('MfaRequired');
    this.connection.off('OtpSent');

    // Stop connection
    if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
      await this.connection.stop();
    }

    this.connection = null;
    this.sessionToken = null;

    console.log('✅ SignalR: Disconnected');
  }

  /**
   * Kill the SignalR connection (hard reset)
   */
  killSignalr(): void {
    this.connection = null;
    this.sessionToken = null;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  /**
   * Get connection state
   */
  getState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }
}

// Singleton instance
let signalRServiceInstance: SignalRService | null = null;

export function getSignalRService(): SignalRService {
  if (!signalRServiceInstance) {
    signalRServiceInstance = new SignalRService();
  }
  return signalRServiceInstance;
}

export default getSignalRService;
