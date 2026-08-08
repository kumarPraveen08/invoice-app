import { CatalogueScreen } from '@/features/catalogue';
import { DeferredMount } from '@/shared/ui';

export default function CatalogueTab() {
  return (
    <DeferredMount>
      <CatalogueScreen />
    </DeferredMount>
  );
}
