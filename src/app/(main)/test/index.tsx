import { Activity, useRef, useState } from 'react';
import { pickFiles } from 'react-native-nitro-file-system';
import { randomUUID } from 'react-native-nitro-crypto';
import { useVideoPlayer, VideoView, type VideoViewProps } from 'expo-video';

import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';

// 👇 Import the newly created service and types
import {
  chunkedUploadService,
  type UploadSession,
} from '@/features/uploads/services/chunked-upload.service';
import type { File } from '@/features/common/schemas/file.schema';
import { router } from 'expo-router';

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

  // 👇 Refs for managing state across renders without triggering re-renders
  const abortControllerRef = useRef<AbortController | null>(null);
  const uploadSessionRef = useRef<UploadSession | null>(null);
  const currentFileRef = useRef<File | null>(null);

  const startUpload = async (file: File) => {
    try {
      abortControllerRef.current = new AbortController();
      setIsUploading(true);

      const result = await chunkedUploadService.uploadFile(
        file,
        {
          onProgress: ({ transferredBytes, totalBytes, progress: percent }) => {
            setProgress(percent);
            setAttachment((prev) =>
              prev ? { ...prev, transferredBytes, totalBytes, updatedAt: Date.now() } : null
            );
          },
          onStatusChange: (status) => setStatusMessage(status),
          onSpeedChange: (speed) => setUploadSpeed(speed),
          onSessionCreated: (session) => {
            uploadSessionRef.current = session;
            setAttachment((prev) =>
              prev && !prev.uploadId ? { ...prev, uploadId: session.fileId } : prev
            );
          },
        },
        uploadSessionRef.current ?? undefined,
        abortControllerRef.current.signal
      );

      setVideoUrl(result.url);
      setStatusMessage('Upload Complete! 🎉');
      setAttachment((prev) =>
        prev
          ? {
              ...prev,
              remoteUrl: result.url,
              transferStatus: 'COMPLETED',
              transferredBytes: prev.totalBytes ?? 0,
              updatedAt: Date.now(),
            }
          : null
      );

      // Clear session after success
      uploadSessionRef.current = null;
      currentFileRef.current = null;
    } catch (error) {
      console.error(error);

      if ((error as Error).message === 'UPLOAD_PAUSED' || (error as Error).name === 'AbortError') {
        setStatusMessage('Upload Paused ⏸️');
        setAttachment((prev) =>
          prev ? { ...prev, transferStatus: 'PAUSED', updatedAt: Date.now() } : null
        );
      } else {
        setStatusMessage('Upload Failed ❌');
        setAttachment((prev) =>
          prev ? { ...prev, transferStatus: 'FAILED', updatedAt: Date.now() } : null
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    setStatusMessage('Waiting for file selection...');

    const importedFiles = await pickFiles({
      multiple: false,
      mode: 'import',
    });

    const selectedFile = importedFiles[0];

    if (!selectedFile || !selectedFile.size) {
      setStatusMessage('File selection cancelled or missing size.');
      return;
    }

    // Map nitro file output to your File schema
    const file: File = {
      uri: selectedFile.path,
      name: selectedFile.name,
      type: selectedFile.type ?? 'application/octet-stream',
      size: selectedFile.size,
      contentType: 'video',
    };

    // Save it to ref so we can pass it to the service again if we resume
    currentFileRef.current = file;

    // Reset UI state
    setProgress(0);
    setUploadSpeed('');
    setVideoUrl('');
    uploadSessionRef.current = null;

    setAttachment({
      id: randomUUID(),
      localUri: file.uri,
      remoteUrl: null,
      mimeType: file.type,
      fileName: file.name,
      fileSize: file.size,
      width: null,
      height: null,
      duration: null,
      thumbnailUri: null,
      uploadId: null,
      transferredBytes: 0,
      totalBytes: file.size,
      transferType: 'UPLOAD',
      transferStatus: 'DOWNLOADING',
      updatedAt: Date.now(),
    });

    await startUpload(file);
  };

  const handlePause = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleResume = async () => {
    if (!uploadSessionRef.current || !currentFileRef.current) {
      return;
    }

    setAttachment((prev) =>
      prev ? { ...prev, transferStatus: 'DOWNLOADING', updatedAt: Date.now() } : null
    );

    await startUpload(currentFileRef.current);
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
                Uploaded: {((attachment?.transferredBytes ?? 0) / 1024 / 1024).toFixed(2)} MB
              </Text>
              <Text size="sm">
                Total: {((attachment?.totalBytes ?? 0) / 1024 / 1024).toFixed(2)} MB
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

      <Button onPress={() => router.push('/(main)/test/chunked-download')}>
        <ButtonText>Go to chunked download test</ButtonText>
      </Button>
    </Box>
  );
}
