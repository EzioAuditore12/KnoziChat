import { getItem, setItem } from 'expo-secure-store';
import { crypto } from 'react-native-nitro-crypto';

const DB_KEYCHAIN_SERVICE = 'knozichat_database_key';

export function getOrGenerateDbKey(): string {
  try {
    // 1. Check if we already created a key on a previous launch
    const key = getItem(DB_KEYCHAIN_SERVICE);

    if (key) return key;

    // 2. If not, generate a new secure random UUID using Nitro Crypto
    // crypto.randomUUID() returns a cryptographically secure UUID
    const newKey = crypto.randomUUID();

    // 3. Save it securely in the Keychain
    setItem(DB_KEYCHAIN_SERVICE, newKey);

    return newKey;
  } catch (error) {
    console.error('Error getting or generating DB key:', error);
    throw error;
  }
}
