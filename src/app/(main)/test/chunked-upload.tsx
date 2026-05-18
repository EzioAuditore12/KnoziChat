import { Activity, useState } from 'react';
import fs, { pickFiles, Paths } from 'react-native-nitro-file-system';
import { Buffer } from 'react-native-nitro-buffer';
import { randomUUID } from 'react-native-nitro-crypto';
import { fetch } from 'react-native-nitro-fetch';
import { useVideoPlayer, VideoView, type VideoViewProps } from 'expo-video';

import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';

import { authorizeUploadApi } from '@/features/uploads/api/authorize-upload.api';
import {
  createAppWriteClient,
  createAppWriteJwtToken,
  createAppWriteSession,
} from '@/features/uploads/config/appwrite';

const CHUNK_SIZE = 5 * 1024 * 1024;

type UploadResult = {
  fileId: string;
  url: string;
};

async function chunkedUploadApi(
  onProgress: (percent: number) => void,
  onStatusChange: (status: string) => void
): Promise<UploadResult> {
  onStatusChange('Waiting for file selection...');

  const importedFiles = await pickFiles({
    multiple: false,
    mode: 'import',
  });

  const file = importedFiles[0];

  if (!file) throw new Error('File selection cancelled.');

  const mimeType = file.type ?? 'application/octet-stream';
  const totalSize = file.size;

  if (!totalSize) {
    throw new Error('Missing file size');
  }

  onStatusChange('Authorizing upload...');

  const { endpoint, projectId, token, userId } = await authorizeUploadApi({
    fileName: file.name,
    mimeType,
  });

  const bucketId = '6a05f3be002a62a78441';

  onStatusChange('Creating secure session...');

  const client = createAppWriteClient({
    endPoint: endpoint,
    projectId,
  });

  await createAppWriteSession({
    client,
    userId,
    token,
  });

  onStatusChange('Generating JWT...');

  const jwt = await createAppWriteJwtToken({ client });

  const fileId = randomUUID();

  let offset = 0;

  onStatusChange('Opening file...');

  const fd = await fs.promises.open(file.path, 'r');

  let uploadedFileResponse: any = null;

  try {
    while (offset < totalSize) {
      const length = Math.min(CHUNK_SIZE, totalSize - offset);

      const chunkBuffer = Buffer.alloc(length);

      fs.readSync(fd, chunkBuffer, 0, length, offset);

      const tempChunkPath = `${Paths.cache}/chunk_${fileId}_${offset}`;

      await fs.promises.writeFile(tempChunkPath, chunkBuffer);

      const formData = new FormData();

      formData.append('fileId', fileId);

      formData.append('file', {
        uri: `file://${tempChunkPath}`,
        name: file.name,
        type: mimeType,
      } as any);

      const headers: Record<string, string> = {
        'x-appwrite-project': projectId,
        'x-appwrite-jwt': jwt,
        'content-range': `bytes ${offset}-${offset + length - 1}/${totalSize}`,
      };

      if (offset > 0) {
        headers['x-appwrite-id'] = fileId;
      }

      const mbUploaded = (offset / (1024 * 1024)).toFixed(1);
      const mbTotal = (totalSize / (1024 * 1024)).toFixed(1);

      onStatusChange(`Uploading chunk: ${mbUploaded} MB / ${mbTotal} MB...`);

      const response = await fetch(`${endpoint}/storage/buckets/${bucketId}/files`, {
        method: 'POST',
        headers,
        body: formData,
      });

      uploadedFileResponse = await response.json();

      await fs.promises.unlink(tempChunkPath).catch(() => {});

      if (!response.ok) {
        throw new Error(
          `Chunk upload failed: ${response.status} - ${JSON.stringify(uploadedFileResponse)}`
        );
      }

      offset += length;

      const percent = Math.round((offset / totalSize) * 100);

      onProgress(Math.min(percent, 100));
    }

    onStatusChange('Finishing up...');

    return {
      fileId: uploadedFileResponse.$id,
      url: `${endpoint}/storage/buckets/${bucketId}/files/${uploadedFileResponse.$id}/view?project=${projectId}`,
    };
  } catch (error) {
    onStatusChange('Upload encountered an error.');
    throw error;
  } finally {
    fs.closeSync(fd);
  }
}

function CustomVideoPlayer({ uri, ...props }: Omit<VideoViewProps, 'player'> & { uri: string }) {
  const player = useVideoPlayer({
    uri,
  });

  return <VideoView player={player} {...props} />;
}

export default function ChunkedUploadTestScreen() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      setProgress(0);
      setStatusMessage('Initializing...');

      const result = await chunkedUploadApi(
        (percent) => {
          setProgress(percent);
        },
        (status) => {
          setStatusMessage(status);
        }
      );

      console.log('Uploaded File ID:', result.fileId);
      console.log('Uploaded Video URL:', result.url);

      setVideoUrl(result.url);

      setStatusMessage('Upload Complete! 🎉');
    } catch (error) {
      console.error(error);
      setStatusMessage('Upload Failed ❌');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box className="flex-1 items-center justify-center p-6">
      <VStack space="md" className="mb-8 w-full max-w-100">
        <Activity mode={isUploading || progress > 0 ? 'visible' : 'hidden'}>
          <HStack className="mb-2 items-end justify-between">
            <Heading size="sm">{isUploading ? 'Uploading File' : 'Upload Status'}</Heading>

            <Text size="sm" className="font-bold">
              {progress}%
            </Text>
          </HStack>

          <Progress value={progress} className="h-3 w-full">
            <ProgressFilledTrack />
          </Progress>

          <Text size="sm" className="mt-2 text-center italic">
            {statusMessage}
          </Text>
        </Activity>
      </VStack>

      <Button onPress={handleUpload} disabled={isUploading} className="min-w-50">
        <Activity mode={isUploading ? 'visible' : 'hidden'}>
          <ButtonSpinner className="mr-2" />
        </Activity>

        <ButtonText>{isUploading ? 'Processing...' : 'Pick & Upload File'}</ButtonText>
      </Button>

      <Activity mode={videoUrl ? 'visible' : 'hidden'}>
        <Box className="mt-8 w-full">
          <Text className="mb-2 text-center text-xs">Uploaded Video Preview</Text>
          <CustomVideoPlayer
            uri={videoUrl}
            style={{
              width: '100%',
              aspectRatio: 16 / 9,
            }}
            nativeControls
            allowsPictureInPicture
          />

          <Text size="xs" className="mt-2">
            {videoUrl}
          </Text>
        </Box>
      </Activity>
    </Box>
  );
}
