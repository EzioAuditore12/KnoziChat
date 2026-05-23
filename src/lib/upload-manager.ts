import type { UploadSession } from '@/features/uploads/services/chunked-upload.service'; // Adjust import

// Map message/attachment ID to its active AbortController
export const activeUploadControllers = new Map<string, AbortController>();

// Map message/attachment ID to its last saved session (for resuming)
export const savedUploadSessions = new Map<string, UploadSession>();
