import axios, { AxiosError } from "axios";

export interface BackendErrorData {
	error: string;
	message: string;
	details?: Array<{
		field: string;
		message: string;
	}>;
}

export class CustomBackendError extends Error {
	public originalError: AxiosError<BackendErrorData>;
	public status?: number;
	public backendData?: BackendErrorData;

	constructor(error: AxiosError<BackendErrorData>) {
		super(error.message);
		this.name = "CustomBackendError";
		this.originalError = error;
		this.status = error.response?.status;
		this.backendData = error.response?.data;
	}

	get backendMessage(): string {
		return this.backendData?.message || this.originalError.message;
	}

	get validationErrors(): Array<{ field: string; message: string }> {
		return this.backendData?.details || [];
	}

	get isValidationError(): boolean {
		return this.validationErrors.length > 0;
	}

	get isConflictError(): boolean {
		return this.status === 409;
	}

	get isBadRequestError(): boolean {
		return this.status === 400;
	}

	static extractResponse(error: unknown): BackendErrorData | undefined {
		if (axios.isAxiosError(error)) {
			return (error as AxiosError<BackendErrorData>).response?.data;
		}
		return undefined;
	}

	static getErrorMessage(error: unknown): string {
		if (axios.isAxiosError(error)) {
			const backendData = (error as AxiosError<BackendErrorData>).response
				?.data;
			return backendData?.message || error.message;
		}
		return error instanceof Error ? error.message : "An unknown error occurred";
	}

	static getValidationErrors(
		error: unknown,
	): Array<{ field: string; message: string }> {
		if (axios.isAxiosError(error)) {
			const backendData = (error as AxiosError<BackendErrorData>).response
				?.data;
			return backendData?.details || [];
		}
		return [];
	}

	static hasValidationErrors(error: unknown): boolean {
		return this.getValidationErrors(error).length > 0;
	}

	static isAxiosError(error: unknown): boolean {
		return axios.isAxiosError(error);
	}

	static getStatusCode(error: unknown): number | undefined {
		if (axios.isAxiosError(error)) {
			return (error as AxiosError<BackendErrorData>).response?.status;
		}
		return undefined;
	}
}
