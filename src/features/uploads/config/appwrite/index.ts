import { env } from '@/env';

import { Account, Client, ID, type Models, Storage } from 'react-native-appwrite';

interface CreateAppWriteClientOptions {
  endPoint: string;
  projectId: string;
}

export function createAppWriteClient({ endPoint, projectId }: CreateAppWriteClientOptions): Client {
  const client = new Client()
    .setEndpoint(endPoint)
    .setProject(projectId)
    .setPlatform(env.PUBLIC_PACKAGE);

  return client;
}

interface UploadFileToAppWriteOptions {
  client: Client;
  bucketId: string;
  file: { uri: string; name: string; type: string; size: number };
}

export async function uploadFileToAppWrite({
  client,
  bucketId,
  file,
}: UploadFileToAppWriteOptions): Promise<Models.File> {
  const storage = new Storage(client);

  const uploadedFile = await storage.createFile({
    bucketId,
    fileId: ID.unique(),
    file,
  });

  return uploadedFile;
}

interface CreateAppWriteSessionOptions {
  client: Client;
  userId: string;
  token: string;
}

export async function createAppWriteSession({
  client,
  userId,
  token,
}: CreateAppWriteSessionOptions) {
  const account = new Account(client);

  try {
    // Check existing session
    const existingSession = await account.getSession('current');

    return existingSession;
  } catch {
    // No active session exists
    const session = await account.createSession({
      userId,
      secret: token,
    });

    return session;
  }
}
