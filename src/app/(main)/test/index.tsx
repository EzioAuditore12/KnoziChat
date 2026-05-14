import { Activity, useState } from 'react';

import { pickFiles } from 'react-native-nitro-file-system';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Image } from '@/components/ui/image';

import { authorizeUploadApi } from '@/features/uploads/api/authorize-upload.api';

import {
  createAppWriteClient,
  createAppWriteSession,
  uploadFileToAppWrite,
} from '@/features/uploads/config/appwrite';

export default function TestScreen() {
  const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
  const [isUploadedSuccessfully, setIsUploadedSuccessfully] = useState(false);

  const handleUploadTestFile = async (): Promise<void> => {
    try {
      setIsUploadedSuccessfully(false);

      const importedFiles = await pickFiles({
        multiple: false,
        mode: 'import',
      });

      const file = importedFiles[0];

      if (!file) return;

      const { bucketId, endpoint, projectId, token, userId } = await authorizeUploadApi({
        fileName: file.name,
        mimeType: file.type ?? 'application/octet-stream',
      });

      const client = createAppWriteClient({
        endPoint: endpoint,
        projectId,
      });

      await createAppWriteSession({
        client,
        userId,
        token,
      });

      const uploadedFile = await uploadFileToAppWrite({
        client,
        bucketId,
        file: {
          uri: file.uri,
          name: file.name,
          type: file.type ?? 'application/octet-stream',
          size: file.size,
        },
      });

      console.log(uploadedFile);

      setUploadedImageUri(file.uri);
      setIsUploadedSuccessfully(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box className="flex-1 items-center justify-center px-6">
      <VStack className="items-center gap-6">
        <Button onPress={handleUploadTestFile}>
          <ButtonText>Pick File</ButtonText>
        </Button>

        <Activity mode={isUploadedSuccessfully && uploadedImageUri ? 'visible' : 'hidden'}>
          <VStack className="items-center gap-4">
            <Text size="xl" className="font-bold">
              Successfully Uploaded 🎉
            </Text>

            <Image
              source={{
                uri: uploadedImageUri ?? undefined,
              }}
              alt="Uploaded Image"
              size="2xl"
              className="rounded-2xl"
            />
          </VStack>
        </Activity>
      </VStack>
    </Box>
  );
}
