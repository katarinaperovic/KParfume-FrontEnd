

export function decodeToken(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }
  
    const decodedPayload = decodePayload(parts[1]);
    return JSON.parse(decodedPayload);
  }
  
  function decodePayload(payload) {
    const base64String = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4); // Add removed '=' padding
    const base64 = base64String + padding;
  
    return atob(base64); // `atob` decodes a base-64 encoded string
  }
  