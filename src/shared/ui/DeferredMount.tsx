import { useEffect, useState, type ReactNode } from 'react';
import { InteractionManager } from 'react-native';
import { ScreenLoading } from './ScreenLoading';

type Props = {
  children: ReactNode;
};

/**
 * Lets navigation commit first, then mounts children after interactions.
 * Use on heavy routes so tab/stack switches are not blocked by screen work.
 */
export function DeferredMount({ children }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setReady(true);
    });
    return () => task.cancel();
  }, []);

  if (!ready) return <ScreenLoading />;
  return children;
}
