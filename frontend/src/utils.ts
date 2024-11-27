import { TCheckPaymentRes } from './types/payFormTypes';

export const shortPolling = async (
  { signal }: Partial<AbortController> = {},
  url: RequestInfo | URL,
  params?: RequestInit,
  timeToLiveSeconds?: number,
): Promise<TCheckPaymentRes | undefined> => {
  try {
    if (!timeToLiveSeconds || (timeToLiveSeconds && timeToLiveSeconds <= 0)) return;

    const expirationTime = Date.now() + timeToLiveSeconds * 1000;
    const response = await fetch(url, { ...params, signal });

    const data = await response.json();
    switch (data?.status) {
      case 'ok':
      case 'fail':
        return Promise.resolve(data);

      default: {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return await shortPolling({ signal }, url, params, (expirationTime - Date.now()) / 1000);
      }
    }
  } catch (e) {
    if (!signal?.reason) {
      console.error('shortPolling error: ', (e as unknown as Error).message);
    }
  }
};

export const isObjectEmpty = (object: Record<string, unknown>): boolean =>
  !Object.keys(object).length;
