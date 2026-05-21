import { useRef, useState } from 'react';

import { fetch } from 'react-native-nitro-fetch';
import fs, { Paths } from 'react-native-nitro-file-system';
import { Buffer } from 'react-native-nitro-buffer';
import { randomUUID } from 'react-native-nitro-crypto';

import { useVideoPlayer, VideoView } from 'expo-video';

import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';

import { authorizeDownloadContentApi } from '@/features/uploads/api/authorize-download-content.api';

const DOWNLOAD_CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

export default function ChunkedDownloadScreen() {
  const [isDownloading, setIsDownloading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [statusMessage, setStatusMessage] = useState('');

  const [transferredMB, setTransferredMB] = useState('0.0');

  const [totalMB, setTotalMB] = useState('0.0');

  const [activeVideoUri, setActiveVideoUri] = useState<string | null>(null);

  const [localFilePath, setLocalFilePath] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const player = useVideoPlayer({
    uri: activeVideoUri ?? '',
  });

  const handleChunkedDownload = async () => {
    try {
      setIsDownloading(true);

      setStatusMessage('Authorizing download...');

      abortControllerRef.current = new AbortController();

      const response = await authorizeDownloadContentApi({
        url: 'https://sgp.cloud.appwrite.io/v1/storage/buckets/6a05f3be002a62a78441/files/fa62b916-c227-4972-a8e4-d1e5f8fff362/view?project=6a05cad20007c64a6ffc',
      });

      const { downloadUrl, size } = response;

      const totalSize = size;

      setTotalMB((totalSize / 1024 / 1024).toFixed(1));

      // Start remote playback instantly
      setActiveVideoUri(downloadUrl);

      setStatusMessage('Preparing local cache...');

      let filePath = localFilePath;

      // Create local file only once
      if (!filePath) {
        filePath = `${Paths.cache}/${randomUUID()}.mp4`;

        setLocalFilePath(filePath);
      }

      // Resume support
      const existingStat = await fs.promises.stat(filePath).catch(() => null);

      let offset = existingStat?.size ?? 0;

      setTransferredMB((offset / 1024 / 1024).toFixed(1));

      setProgress(Math.floor((offset / totalSize) * 100));

      // Open file correctly
      const fd = await fs.promises.open(filePath, offset > 0 ? 'r+' : 'w');

      try {
        while (offset < totalSize) {
          if (abortControllerRef.current?.signal.aborted) {
            throw new Error('DOWNLOAD_ABORTED');
          }

          const end = Math.min(offset + DOWNLOAD_CHUNK_SIZE - 1, totalSize - 1);

          setStatusMessage(`Downloading chunk ${Math.floor(offset / DOWNLOAD_CHUNK_SIZE) + 1}...`);

          const chunkResponse = await fetch(downloadUrl, {
            method: 'GET',

            headers: {
              Range: `bytes=${offset}-${end}`,
              Accept: '*/*',
              Connection: 'keep-alive',
            },

            signal: abortControllerRef.current.signal,
          });

          // MUST be partial content
          if (chunkResponse.status !== 206) {
            throw new Error(`Expected 206 but got ${chunkResponse.status}`);
          }

          const arrayBuffer = await chunkResponse.arrayBuffer();

          const chunkBuffer = Buffer.from(arrayBuffer);

          // Write at exact offset
          fs.writeSync(fd, chunkBuffer, 0, chunkBuffer.byteLength, offset);

          offset += chunkBuffer.byteLength;

          setTransferredMB((offset / 1024 / 1024).toFixed(1));

          setProgress(Math.floor((offset / totalSize) * 100));
        }

        setStatusMessage('Download complete. Switched to local file.');

        // Switch playback to local cached file
        setActiveVideoUri(`file://${filePath}`);
      } finally {
        fs.closeSync(fd);
      }
    } catch (error) {
      console.error(error);

      if (
        (error as Error).message === 'DOWNLOAD_ABORTED' ||
        (error as Error).name === 'AbortError'
      ) {
        setStatusMessage('Download paused.');
      } else {
        setStatusMessage('Download failed.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePauseDownload = () => {
    abortControllerRef.current?.abort();
  };

  const handleDeleteCache = async () => {
    try {
      if (!localFilePath) {
        return;
      }

      const exists = await fs.promises.stat(localFilePath).catch(() => null);

      if (exists) {
        await fs.promises.unlink(localFilePath);
      }

      setProgress(0);

      setTransferredMB('0.0');

      setStatusMessage('Local cache deleted.');

      setLocalFilePath(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box className="flex-1 items-center justify-center p-6">
      <Heading className="mb-6">Chunked Download Test</Heading>

      {/* Video Player */}
      <Box className="mb-8 w-full overflow-hidden rounded-xl bg-neutral-100">
        {activeVideoUri ? (
          <VideoView
            player={player}
            style={{
              width: '100%',
              aspectRatio: 16 / 9,
            }}
            nativeControls
            allowsPictureInPicture
          />
        ) : (
          <Box className="h-48 items-center justify-center">
            <Text>Video will appear here</Text>
          </Box>
        )}
      </Box>

      {/* Progress */}
      {(isDownloading || progress > 0) && (
        <Box className="mb-6 w-full">
          <Box className="mb-2 flex-row items-center justify-between">
            <Text size="sm">{isDownloading ? 'Downloading...' : 'Download Paused'}</Text>

            <Text size="sm">{progress}%</Text>
          </Box>

          <Progress value={progress} className="h-3 w-full">
            <ProgressFilledTrack />
          </Progress>

          <Box className="mt-2 flex-row items-center justify-between">
            <Text size="xs" className="max-w-[70%] italic">
              {statusMessage}
            </Text>

            <Text size="xs">
              {transferredMB} / {totalMB} MB
            </Text>
          </Box>
        </Box>
      )}

      {/* Controls */}
      <Box className="flex-row gap-3">
        <Button onPress={handleChunkedDownload} disabled={isDownloading} className="min-w-32.5">
          {isDownloading && <ButtonSpinner className="mr-2" />}

          <ButtonText>{progress > 0 ? 'Resume Download' : 'Start Download'}</ButtonText>
        </Button>

        <Button onPress={handlePauseDownload} disabled={!isDownloading} variant="outline">
          <ButtonText>Pause</ButtonText>
        </Button>

        <Button onPress={handleDeleteCache} variant="outline">
          <ButtonText>Delete Cache</ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
