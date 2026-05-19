import { Activity, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

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

import { authorizeUploadVideoApi } from '@/features/uploads/api/authorize-upload-video.api';

const MAX_CHUNK_SIZE = 8 * 1024 * 1024;

type ChatAttachment = {
  id: string;
  localUri: string | null;
  remoteUrl: string | null;
  mimeType: string | null;
  fileName: string | null;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  thumbnailUri: string | null;
  uploadId: string | null;
  transferredBytes: number;
  totalBytes: number | null;
  transferType: 'UPLOAD' | 'DOWNLOAD';
  transferStatus: 'PENDING' | 'DOWNLOADING' | 'PAUSED' | 'COMPLETED' | 'FAILED';
  updatedAt: number;
};

type UploadResult = {
  fileId: string;
  url: string;
};

type UploadSession = {
  fileId: string;
  filePath: string;
  offset: number;
  totalSize: number;
  mimeType: string;
  fileName: string;
  url: string;
  endpoint: string;
  bucketId: string;
  authorizationToken: string;
  projectId: string;
};

function getInitialChunkSize(networkType: string | null, cellularGeneration: string | null) {
  if (networkType === 'wifi') {
    return 4 * 1024 * 1024;
  }

  switch (cellularGeneration) {
    case '2g':
      return 128 * 1024;

    case '3g':
      return 512 * 1024;

    case '4g':
      return 2 * 1024 * 1024;

    case '5g':
      return 6 * 1024 * 1024;

    default:
      return 512 * 1024;
  }
}

function adaptChunkSize(bytesPerSecond: number) {
  if (bytesPerSecond < 300_000) {
    return 256 * 1024;
  }

  if (bytesPerSecond < 1_000_000) {
    return 512 * 1024;
  }

  if (bytesPerSecond < 5_000_000) {
    return 2 * 1024 * 1024;
  }

  if (bytesPerSecond < 15_000_000) {
    return 4 * 1024 * 1024;
  }

  return MAX_CHUNK_SIZE;
}

async function chunkedUploadApi(
  pauseRef: React.MutableRefObject<boolean>,
  uploadSessionRef: React.MutableRefObject<UploadSession | null>,
  onAttachmentChange: (attachment: ChatAttachment) => void,
  onProgress: (percent: number) => void,
  onStatusChange: (status: string) => void,
  onSpeedChange: (speed: string) => void
): Promise<UploadResult> {
  let file:
    | {
        path: string;
        type?: string | null;
        size?: number;
        name: string;
      }
    | undefined;

  if (uploadSessionRef.current) {
    file = {
      path: uploadSessionRef.current.filePath,
      type: uploadSessionRef.current.mimeType,
      size: uploadSessionRef.current.totalSize,
      name: uploadSessionRef.current.fileName,
    };
  } else {
    onStatusChange('Waiting for file selection...');

    const importedFiles = await pickFiles({
      multiple: false,
      mode: 'import',
    });

    file = importedFiles[0];
  }

  if (!file) {
    throw new Error('File selection cancelled.');
  }

  const mimeType = file.type ?? 'application/octet-stream';
  const totalSize = file.size;

  if (!totalSize) {
    throw new Error('Missing file size');
  }

  const existingSession = uploadSessionRef.current;

  const attachmentId = existingSession?.fileId ?? randomUUID();

  let attachment: ChatAttachment = {
    id: attachmentId,
    localUri: file.path,
    remoteUrl: null,
    mimeType,
    fileName: file.name,
    fileSize: totalSize,
    width: null,
    height: null,
    duration: null,
    thumbnailUri: null,
    uploadId: existingSession?.fileId ?? null,
    transferredBytes: existingSession?.offset ?? 0,
    totalBytes: totalSize,
    transferType: 'UPLOAD',
    transferStatus: 'DOWNLOADING',
    updatedAt: Date.now(),
  };

  onAttachmentChange(attachment);

  const networkState = await NetInfo.fetch();

  let dynamicChunkSize = getInitialChunkSize(
    networkState.type,
    networkState.type === 'cellular' ? networkState.details.cellularGeneration : null
  );

  const uploadConfig =
    uploadSessionRef.current ??
    (await authorizeUploadVideoApi({
      fileName: file.name,
      mimeType,
    }));

  const { url, endpoint, bucketId, authorizationToken, projectId } = uploadConfig;

  const fileId = existingSession?.fileId ?? randomUUID();

  let offset = existingSession?.offset ?? 0;

  onStatusChange('Opening file...');

  const fd = await fs.promises.open(file.path, 'r');

  let uploadedFileResponse: any = null;

  try {
    while (offset < totalSize) {
      if (pauseRef.current) {
        attachment = {
          ...attachment,
          transferredBytes: offset,
          transferStatus: 'PAUSED',
          updatedAt: Date.now(),
        };

        onAttachmentChange(attachment);

        uploadSessionRef.current = {
          fileId,
          filePath: file.path,
          offset,
          totalSize,
          mimeType,
          fileName: file.name,
          url,
          endpoint,
          bucketId,
          authorizationToken,
          projectId,
        };

        onStatusChange('Upload paused');

        throw new Error('UPLOAD_PAUSED');
      }

      const length = Math.min(dynamicChunkSize, totalSize - offset);

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
        'x-appwrite-jwt': authorizationToken,
        'content-range': `bytes ${offset}-${offset + length - 1}/${totalSize}`,
      };

      if (offset > 0) {
        headers['x-appwrite-id'] = fileId;
      }

      const mbUploaded = (offset / (1024 * 1024)).toFixed(1);
      const mbTotal = (totalSize / (1024 * 1024)).toFixed(1);

      onStatusChange(`Uploading chunk: ${mbUploaded} MB / ${mbTotal} MB...`);

      const uploadStartedAt = Date.now();

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const uploadEndedAt = Date.now();

      uploadedFileResponse = await response.json();

      await fs.promises.unlink(tempChunkPath).catch(() => {});

      if (!response.ok) {
        throw new Error(
          `Chunk upload failed: ${response.status} - ${JSON.stringify(uploadedFileResponse)}`
        );
      }

      const seconds = (uploadEndedAt - uploadStartedAt) / 1000;

      const bytesPerSecond = length / seconds;

      dynamicChunkSize = adaptChunkSize(bytesPerSecond);

      const mbPerSecond = bytesPerSecond / 1024 / 1024;

      const readableSpeed =
        mbPerSecond >= 1
          ? `${mbPerSecond.toFixed(2)} MB/s`
          : `${(bytesPerSecond / 1024).toFixed(0)} KB/s`;

      onSpeedChange(readableSpeed);

      offset += length;

      uploadSessionRef.current = {
        fileId,
        filePath: file.path,
        offset,
        totalSize,
        mimeType,
        fileName: file.name,
        url,
        endpoint,
        bucketId,
        authorizationToken,
        projectId,
      };

      attachment = {
        ...attachment,
        transferredBytes: offset,
        updatedAt: Date.now(),
      };

      onAttachmentChange(attachment);

      const percent = Math.round((offset / totalSize) * 100);

      onProgress(Math.min(percent, 100));
    }

    const remoteUrl = `${endpoint}/storage/buckets/${bucketId}/files/${uploadedFileResponse.$id}/view?project=${projectId}`;

    attachment = {
      ...attachment,
      remoteUrl,
      transferredBytes: totalSize,
      transferStatus: 'COMPLETED',
      updatedAt: Date.now(),
    };

    onAttachmentChange(attachment);

    uploadSessionRef.current = null;

    onStatusChange('Finishing up...');

    return {
      fileId: uploadedFileResponse.$id,
      url: remoteUrl,
    };
  } catch (error) {
    if ((error as Error).message !== 'UPLOAD_PAUSED') {
      attachment = {
        ...attachment,
        transferStatus: 'FAILED',
        updatedAt: Date.now(),
      };

      onAttachmentChange(attachment);

      onStatusChange('Upload encountered an error.');
    }

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
  const [uploadSpeed, setUploadSpeed] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);

  const pauseRef = useRef(false);

  const uploadSessionRef = useRef<UploadSession | null>(null);

  const startUpload = async () => {
    try {
      pauseRef.current = false;

      setIsUploading(true);

      const result = await chunkedUploadApi(
        pauseRef,
        uploadSessionRef,
        (updatedAttachment) => {
          setAttachment(updatedAttachment);
        },
        (percent) => {
          setProgress(percent);
        },
        (status) => {
          setStatusMessage(status);
        },
        (speed) => {
          setUploadSpeed(speed);
        }
      );

      setVideoUrl(result.url);

      setStatusMessage('Upload Complete! 🎉');
    } catch (error) {
      console.error(error);

      if ((error as Error).message !== 'UPLOAD_PAUSED') {
        setStatusMessage('Upload Failed ❌');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    setProgress(0);
    setUploadSpeed('');
    setVideoUrl('');
    setStatusMessage('Initializing...');

    await startUpload();
  };

  const handlePause = () => {
    pauseRef.current = true;
  };

  const handleResume = async () => {
    if (!uploadSessionRef.current) {
      return;
    }

    setStatusMessage('Resuming upload...');

    await startUpload();
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

          <Activity mode={uploadSpeed ? 'visible' : 'hidden'}>
            <Text size="xs" className="mt-1 text-center">
              Upload Speed: {uploadSpeed}
            </Text>
          </Activity>

          <Activity mode={attachment ? 'visible' : 'hidden'}>
            <Box className="border-outline-200 mt-4 rounded-xl border p-3">
              <Text size="sm">File: {attachment?.fileName}</Text>

              <Text size="sm">Status: {attachment?.transferStatus}</Text>

              <Text size="sm">
                Uploaded: {((attachment?.transferredBytes ?? 0) / 1024 / 1024).toFixed(2)}
                MB
              </Text>

              <Text size="sm">
                Total: {((attachment?.totalBytes ?? 0) / 1024 / 1024).toFixed(2)}
                MB
              </Text>
            </Box>
          </Activity>
        </Activity>
      </VStack>

      <HStack space="md">
        <Button onPress={handleUpload} disabled={isUploading} className="min-w-40">
          <Activity mode={isUploading ? 'visible' : 'hidden'}>
            <ButtonSpinner className="mr-2" />
          </Activity>

          <ButtonText>{isUploading ? 'Processing...' : 'Pick & Upload'}</ButtonText>
        </Button>

        <Button
          onPress={handlePause}
          disabled={!isUploading}
          variant="outline"
          className="min-w-30">
          <ButtonText>Pause</ButtonText>
        </Button>

        <Button
          onPress={handleResume}
          disabled={isUploading || !uploadSessionRef.current}
          variant="outline"
          className="min-w-30">
          <ButtonText>Resume</ButtonText>
        </Button>
      </HStack>

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
