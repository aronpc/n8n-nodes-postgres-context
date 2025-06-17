import { LoggerProxy } from 'n8n-workflow';

/**
 * Utility function for logging errors
 * @param message - The error message
 * @param error - The error object
 */
export function logError(message: string, error: Error | unknown): void {
  if (LoggerProxy.error) {
    LoggerProxy.error(message, { error });
  }
}
