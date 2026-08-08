import { ReportsScreen } from '@/features/reports';
import { DeferredMount } from '@/shared/ui';

export default function ReportsTab() {
  return (
    <DeferredMount>
      <ReportsScreen />
    </DeferredMount>
  );
}
