/**
 * Fetch wrapper for @countrystatecity/countries-browser
 */

import { getConfig } from './config';
import { NetworkError } from './errors';

/**
 * Fetch a JSON resource from the configured CDN
 * @param path - Path relative to baseURL (e.g., '/data/countries.json')
 * @returns Parsed JSON data
 * @throws NetworkError on non-2xx response
 */
export async function fetchJSON<T>(path: string): Promise<T> {
  const config = getConfig();
  const url = `${config.baseURL}${path}`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(config.timeout),
    headers: {
      'Accept': 'application/json',
      ...config.headers,
    },
  });

  if (!response.ok) {
    throw new NetworkError(
      `Failed to load ${path}: ${response.statusText}`,
      url,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}
