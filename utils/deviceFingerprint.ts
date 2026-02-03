// Device fingerprinting utility to prevent abuse across multiple accounts
export function generateDeviceFingerprint(): string {
  // Combine multiple browser characteristics to create a unique fingerprint
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let canvasFingerprint = 'unknown';
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 100, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('baseline-fp', 2, 2);
    canvasFingerprint = canvas.toDataURL().slice(0, 50);
  }

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory || 0,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvasFingerprint,
  };

  // Create a hash from the fingerprint object
  const fingerprintString = JSON.stringify(fingerprint);
  return simpleHash(fingerprintString);
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export function getDeviceId(): string {
  // Check for existing device ID in localStorage
  let deviceId = localStorage.getItem('baseline_device_id');
  
  if (!deviceId) {
    // Generate new device ID combining timestamp and random value
    deviceId = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('baseline_device_id', deviceId);
  }
  
  return deviceId;
}

export function getFullDeviceIdentifier(): string {
  const deviceId = getDeviceId();
  const fingerprint = generateDeviceFingerprint();
  
  // Combine both for a robust identifier
  return `${deviceId}_${fingerprint}`;
}
