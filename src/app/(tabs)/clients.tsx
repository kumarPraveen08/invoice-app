import { ClientsScreen } from '@/features/customers';
import { DeferredMount } from '@/shared/ui';

export default function ClientsTab() {
  return (
    <DeferredMount>
      <ClientsScreen />
    </DeferredMount>
  );
}
