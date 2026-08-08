import { useEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  children: ReactNode;
};

/**
 * Lets the navigation frame commit, then mounts children on idle.
 * Prefer this over mounting heavy screens during the transition.
 */
export function DeferredMount({ children }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestIdleCallback(() => setReady(true), { timeout: 100 });
    return () => cancelIdleCallback(id);
  }, []);

  // Blank frame — avoid Compose Host spinner (bridge cost during nav).
  if (!ready) return <View style={{ flex: 1 }} />;
  return children;
}
