// Platform Information Utility
// Based on Vault22 Flutter implementation

export interface PlatformInfo {
  deviceType: string;
  appVersion: string;
  osVersion: string;
  versionCode: number;
  appBuild: string | null;
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
}

/**
 * Get platform information for API requests
 */
export function getPlatformInfo(): PlatformInfo {
  const platform = detectPlatform();
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

  return {
    deviceType: `Flutter - ${platform}`,
    appVersion: appVersion,
    osVersion: navigator.userAgent,
    versionCode: 1,
    appBuild: null,
  };
}

/**
 * Get or create device ID (persistent)
 */
export function getDeviceId(): string {
  const STORAGE_KEY = 'vault22_device_id';
  let deviceId = localStorage.getItem(STORAGE_KEY);

  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem(STORAGE_KEY, deviceId);
  }

  return deviceId;
}

/**
 * Get device name (browser + OS)
 */
export function getDeviceName(): string {
  const browser = detectBrowser();
  const os = detectOS();
  return `${browser} on ${os}`;
}

/**
 * Get complete device information
 */
export function getDeviceInfo(): DeviceInfo {
  return {
    deviceId: getDeviceId(),
    deviceName: getDeviceName(),
  };
}

// Private helper functions

function detectPlatform(): string {
  const ua = navigator.userAgent.toLowerCase();

  if (/android/i.test(ua)) return 'Android';
  if (/ipad|iphone|ipod/.test(ua)) return 'iOS';
  if (/macintosh|mac os x/i.test(ua)) return 'MacOS';
  if (/windows/i.test(ua)) return 'Windows';
  if (/linux/i.test(ua)) return 'Linux';

  return 'Web';
}

function detectBrowser(): string {
  const ua = navigator.userAgent;

  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';

  return 'Browser';
}

function detectOS(): string {
  const ua = navigator.userAgent;

  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';

  return 'Unknown OS';
}

function generateDeviceId(): string {
  // Generate UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
