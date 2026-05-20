import fs, { Paths } from 'react-native-nitro-file-system';
import { Buffer } from 'react-native-nitro-buffer';
import { randomUUID } from 'react-native-nitro-crypto';
import { fetch } from 'react-native-nitro-fetch';
import type { File } from '@/features/common/schemas/file.schema';

import { authorizeUploadVideoApi } from '@/features/uploads/api/authorize-upload-video.api';

// 👇 Appwrite STRICTLY requires chunks to be exactly 5MB (except the last one)
const APPWRITE_CHUNK_SIZE = 5 * 1024 * 1024;

export interface UploadProgress {
  transferredBytes: number;
  totalBytes: number;
  progress: number;
}

export interface UploadSession {
  fileId: string;
  offset: number;
  totalSize: number;
  url: string;
  endpoint: string;
  bucketId: string;
  authorizationToken: string;
  projectId: string;
}

export interface UploadResult {
  fileId: string;
  url: string;
}

export interface UploadCallbacks {
  onProgress?: (progress: UploadProgress) => void;
  onSpeedChange?: (speed: string) => void;
  onStatusChange?: (status: string) => void;
  onSessionCreated?: (session: UploadSession) => void;
}

export class ChunkUploadService {
  async uploadFile(
    file: File,
    callbacks?: UploadCallbacks,
    existingSession?: UploadSession,
    abortSignal?: AbortSignal
  ): Promise<UploadResult> {
    callbacks?.onStatusChange?.('Preparing upload...');

    const uploadConfig =
      existingSession ??
      (await authorizeUploadVideoApi({
        fileName: file.name,
        mimeType: file.type,
      }));

    const { url, endpoint, bucketId, authorizationToken, projectId } = uploadConfig;
    const fileId = existingSession?.fileId ?? randomUUID();
    const totalSize = file.size;
    let offset = existingSession?.offset ?? 0;
    let uploadedFileResponse: any = null;

    callbacks?.onSessionCreated?.({
      fileId,
      offset,
      totalSize,
      url,
      endpoint,
      bucketId,
      authorizationToken,
      projectId,
    });

    const filePath = this.getFilePath(file.uri);
    const fd = await fs.promises.open(filePath, 'r');

    try {
      while (offset < totalSize) {
        if (abortSignal?.aborted) {
          throw new Error('UPLOAD_PAUSED');
        }

        // 👇 Use the strict 5MB chunk size instead of dynamic sizes
        const length = Math.min(APPWRITE_CHUNK_SIZE, totalSize - offset);
        const uploadStartedAt = Date.now();

        uploadedFileResponse = await this.uploadChunk({
          file,
          fd,
          fileId,
          offset,
          length,
          totalSize,
          url,
          projectId,
          authorizationToken,
          abortSignal,
        });

        const uploadEndedAt = Date.now();
        const seconds = (uploadEndedAt - uploadStartedAt) / 1000;
        const bytesPerSecond = length / seconds;

        const mbPerSecond = bytesPerSecond / 1024 / 1024;
        const readableSpeed =
          mbPerSecond >= 1
            ? `${mbPerSecond.toFixed(2)} MB/s`
            : `${(bytesPerSecond / 1024).toFixed(0)} KB/s`;

        callbacks?.onSpeedChange?.(readableSpeed);

        offset += length;

        callbacks?.onSessionCreated?.({
          fileId,
          offset,
          totalSize,
          url,
          endpoint,
          bucketId,
          authorizationToken,
          projectId,
        });

        callbacks?.onProgress?.({
          transferredBytes: offset,
          totalBytes: totalSize,
          progress: Math.min(Math.round((offset / totalSize) * 100), 100),
        });

        callbacks?.onStatusChange?.(`Uploading ${Math.round((offset / totalSize) * 100)}%`);
      }

      callbacks?.onStatusChange?.('Upload completed');

      return {
        fileId: uploadedFileResponse.$id,
        url: `${endpoint}/storage/buckets/${bucketId}/files/${uploadedFileResponse.$id}/view?project=${projectId}`,
      };
    } catch (error) {
      if ((error as Error).message !== 'UPLOAD_PAUSED' && (error as Error).name !== 'AbortError') {
        callbacks?.onStatusChange?.('Upload failed');
      }
      throw error;
    } finally {
      fs.closeSync(fd);
    }
  }

  private async uploadChunk({
    file,
    fd,
    fileId,
    offset,
    length,
    totalSize,
    url,
    projectId,
    authorizationToken,
    abortSignal,
  }: {
    file: File;
    fd: number;
    fileId: string;
    offset: number;
    length: number;
    totalSize: number;
    url: string;
    projectId: string;
    authorizationToken: string;
    abortSignal?: AbortSignal;
  }) {
    const chunkBuffer = Buffer.alloc(length);
    fs.readSync(fd, chunkBuffer, 0, length, offset);

    const tempChunkPath = await this.createTempChunk(fileId, offset, chunkBuffer);

    try {
      const formData = new FormData();
      formData.append('fileId', fileId);
      formData.append('file', {
        uri: `file://${tempChunkPath}`,
        name: file.name,
        type: file.type,
      } as any);

      const headers: Record<string, string> = {
        'x-appwrite-project': projectId,
        'x-appwrite-jwt': authorizationToken,
        'content-range': `bytes ${offset}-${offset + length - 1}/${totalSize}`,
      };

      if (offset > 0) {
        headers['x-appwrite-id'] = fileId;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        signal: abortSignal,
      });

      let json;
      try {
        json = await response.json();
      } catch {
        json = { error: 'Failed to parse server response' };
      }

      if (!response.ok) {
        throw new Error(`Chunk upload failed: ${response.status} - ${JSON.stringify(json)}`);
      }

      return json;
    } finally {
      await fs.promises.unlink(tempChunkPath).catch(() => {});
    }
  }

  async persistThumbnail(file: File): Promise<string | null> {
    if (!file.thumbnail) {
      return null;
    }

    try {
      const thumbnailDirectory = `${Paths.document}/thumbnails`;
      await fs.promises.mkdir(thumbnailDirectory).catch(() => {});

      const extension = file.thumbnail.split('.').pop() ?? 'jpg';
      const thumbnailPath = `${thumbnailDirectory}/${Date.now()}-${randomUUID()}.${extension}`;

      await fs.promises.copyFile(file.thumbnail, thumbnailPath);
      return `file://${thumbnailPath}`;
    } catch (error) {
      console.error('Failed to persist thumbnail:', error);
      return null;
    }
  }

  private async createTempChunk(fileId: string, offset: number, buffer: Buffer) {
    const tempChunkPath = `${Paths.cache}/chunk_${fileId}_${offset}`;
    await fs.promises.writeFile(tempChunkPath, buffer);
    return tempChunkPath;
  }

  private getFilePath(uri: string) {
    return uri.startsWith('file://') ? uri.replace('file://', '') : uri;
  }
}

export const chunkedUploadService = new ChunkUploadService();
