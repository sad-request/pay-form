import { useEffect, useState } from 'react';
import { shortPolling } from '../utils';
import { API_PAY_CHECK } from '../constants';

export const useCheckPayment = ({ isSended, pid }: { isSended: boolean; pid: string }) => {
  const [checkingStatus, setCheckingStatus] = useState<string>('');
  const abortController = new AbortController();

  useEffect(() => {
    const pollForCheck = async () => {
      const response = await shortPolling(
        { signal: abortController.signal },
        API_PAY_CHECK + '/' + pid,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        },
        30 * 60,
      );

      response && setCheckingStatus(response.status);
    };

    pid && pollForCheck();

    return () => abortController.abort();
  }, [isSended]);

  return { checkingStatus };
};
