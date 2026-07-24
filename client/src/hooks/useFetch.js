import { useCallback, useEffect, useState } from 'react';

/**
 * Generic data-fetching hook: runs `fetcher` whenever `deps` change and tracks
 * loading / error / data so components don't repeat that boilerplate.
 * Returns a `reload` function for manual refreshes after a mutation.
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fetcher, deps);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);

    run()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Something went wrong.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [run]);

  useEffect(load, [load]);

  return { data, loading, error, reload: load };
}
