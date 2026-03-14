export const DEFAULT_TIMEOUT_MS = 10000;

type FetchHtmlOptions = {
  timeoutMs?: number;
};

type HttpError = Error & { status?: number };

export const fetchHtml = async (
  url: string,
  { timeoutMs = DEFAULT_TIMEOUT_MS }: FetchHtmlOptions = {},
): Promise<string> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort(new Error('Request timeout'));
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'hacker-news-api/1.0',
        Accept: 'text/html',
      },
    });

    if (!response.ok) {
      const error = new Error(`Request failed with status ${response.status}`) as HttpError;
      error.status = response.status;
      throw error;
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
};
