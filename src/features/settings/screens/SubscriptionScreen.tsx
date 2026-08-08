import { Button, Text, useTheme } from '@/shared/design-system';
import { showSnackbar } from '@/shared/ui';
import { SettingsGroup, SettingsRow } from '../components/SettingsList';
import { SettingsScroll } from '../components/SettingsScroll';

/** Plan overview stub until store billing is wired. */
export function SubscriptionScreen() {
  const { space } = useTheme();

  return (
    <SettingsScroll>
      <Text variant="title" style={{ marginBottom: space.xs }}>
        Free
      </Text>
      <Text variant="body" muted style={{ marginBottom: space['2xl'] }}>
        Your current plan. Upgrade anytime for higher limits and no watermark.
      </Text>

      <SettingsGroup title="Included">
        <SettingsRow
          icon="receipt"
          title="5 invoices / month"
          showChevron={false}
        />
        <SettingsRow
          icon="people-outline"
          title="25 customers"
          showChevron={false}
        />
        <SettingsRow
          icon="grid-view"
          title="50 catalogue items"
          showChevron={false}
        />
        <SettingsRow
          icon="water-drop"
          title="Invoice watermark"
          subtitle="Removed on paid plans"
          showChevron={false}
          last
        />
      </SettingsGroup>

      <SettingsGroup title="Paid plans">
        <SettingsRow
          icon="rocket-launch"
          title="Starter · Growth · Business"
          subtitle="Higher limits, templates, reports, and more"
          showChevron={false}
          last
        />
      </SettingsGroup>

      <Button
        label="Upgrade"
        icon="diamond"
        onPress={() =>
          showSnackbar('In-app purchases will be available in a later update.')
        }
        style={{
          alignSelf: 'stretch',
          justifyContent: 'center',
          marginTop: space.sm,
        }}
      />
    </SettingsScroll>
  );
}
