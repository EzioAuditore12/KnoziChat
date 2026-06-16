import * as Keychain from 'react-native-keychain';
import { crypto } from 'react-native-nitro-crypto';

const DB_KEYCHAIN_SERVICE = 'knozichat_database_key';

export async function getOrGenerateDbKey(): Promise<string> {
  try {
    // 1. Check if we already created a key on a previous launch
    const credentials = await Keychain.getGenericPassword({ service: DB_KEYCHAIN_SERVICE });

    if (credentials) return credentials.password;

    // 2. If not, generate a new secure random UUID using Nitro Crypto
    // crypto.randomUUID() returns a cryptographically secure UUID
    const newKey = crypto.randomUUID();

    // 3. Save it securely in the Keychain
    await Keychain.setGenericPassword(DB_KEYCHAIN_SERVICE, newKey, {
      service: DB_KEYCHAIN_SERVICE,
    });

    return newKey;
  } catch (error) {
    console.error('Error getting or generating DB key:', error);
    throw error;
  }
}
