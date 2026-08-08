import { SettingsScreen } from '@/features/settings/screens/SettingsScreen';
import { DeferredMount } from '@/shared/ui';

export default function ToolsTab() {
  return (
    <DeferredMount>
      <SettingsScreen withTabBar />
    </DeferredMount>
  );
}
