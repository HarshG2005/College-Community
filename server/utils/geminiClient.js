import pLimit from 'p-limit';
import pRetry from 'p-retry';

const CONCURRENCY = parseInt(process.env.GEMINI_CONCURRENCY, 10) || 2;
const limit = pLimit(CONCURRENCY);

/**
 * Detects if an error is a rate-limit / quota error from the AI API.
 * Scans message and details for keywords like "429", "quota", "rate limit", "too many requests".
 */
export function isRateLimitError(error) {
    if (!error) return false;
    const message = (error.message || '') + '';
    const status = (error.status ?? error.statusCode ?? '') + '';
    const details = (error.errorDetails && JSON.stringify(error.errorDetails)) || '';
    const combined = [message, status, details].join(' ').toLowerCase();
    return (
        /429|quota|rate\s*limit|too\s*many\s*requests|exceeded.*quota/i.test(combined)
    );
}

/**
 * Runs a Gemini generateContent call with:
 * - Concurrency limit (default 2 concurrent requests)
 * - Automatic retries on rate-limit (429) only
 * - Exponential backoff: 2s, 4s, 8s, ... (minTimeout 2000, factor 2, maxTimeout 30s)
 */
export async function generateContentWithRetry(model, prompt, options = {}) {
    const {
        retries = 5,
        minTimeout = 2000,
        maxTimeout = 30000,
        factor = 2,
    } = options;

    return limit(() =>
        pRetry(
            () => model.generateContent(prompt),
            {
                retries,
                minTimeout,
                maxTimeout,
                factor,
                shouldRetry: ({ error }) => isRateLimitError(error),
                onFailedAttempt: ({ error, attemptNumber, retriesLeft }) => {
                    if (isRateLimitError(error)) {
                        console.warn(
                            `[Gemini] Rate limit (429), retrying... attempt ${attemptNumber}, ${retriesLeft} left`
                        );
                    }
                },
            }
        )
    );
}
