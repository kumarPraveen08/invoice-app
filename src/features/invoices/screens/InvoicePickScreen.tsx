import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Icon, Text, useTheme } from '@/shared/design-system';
import { useCatalogueStore } from '@/features/catalogue';
import { useClientsStore } from '@/features/customers';
import { SettingsGroup } from '@/features/settings/components/SettingsList';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import { useSettingsStore } from '@/features/settings/store';
import { SearchField } from '@/shared/ui';
import { formatMoney } from '../format';
import { setInvoicePick } from '../pickResult';

type Mode = 'client' | 'catalogue';

export default function InvoicePickScreen() {
  const { colors, space } = useTheme();
  const navigation = useNavigation();
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const mode: Mode = modeParam === 'catalogue' ? 'catalogue' : 'client';
  const clients = useClientsStore((s) => s.clients);
  const catalogue = useCatalogueStore((s) => s.items);
  const currency = useSettingsStore((s) => s.preferences.currency);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string[]>([]);

  const confirmCatalogue = () => {
    if (picked.length === 0) return;
    setInvoicePick({ type: 'catalogue', ids: picked });
    router.back();
  };

  useEffect(() => {
    navigation.setOptions({
      title: mode === 'client' ? 'Select client' : 'Add from catalogue',
      headerRight:
        mode === 'catalogue'
          ? () => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add selected items"
                disabled={picked.length === 0}
                onPress={confirmCatalogue}
                hitSlop={8}
                style={{ paddingHorizontal: 4, opacity: picked.length === 0 ? 0.4 : 1 }}
              >
                <Text
                  variant="body"
                  style={{ color: colors.primary, fontWeight: '700' }}
                >
                  {picked.length === 0 ? 'Add' : `Add (${picked.length})`}
                </Text>
              </Pressable>
            )
          : undefined,
    });
  }, [mode, navigation, picked, colors.primary]);

  const q = query.trim().toLowerCase();

  const clientRows = useMemo(() => {
    const rows = clients.map((client) => ({
      id: client.id,
      title: client.businessName || client.name,
      subtitle: [
        client.businessName ? client.name : null,
        client.phone || client.email || client.address,
      ]
        .filter(Boolean)
        .join(' · '),
    }));
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.subtitle.toLowerCase().includes(q),
    );
  }, [clients, q]);

  const catalogueRows = useMemo(() => {
    const rows = catalogue.map((item) => ({
      id: item.id,
      title: item.name,
      subtitle: `${item.sku} · ${item.unit} · ${formatMoney(item.price, currency)}`,
    }));
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.subtitle.toLowerCase().includes(q),
    );
  }, [catalogue, currency, q]);

  const rows = mode === 'client' ? clientRows : catalogueRows;

  const toggle = (id: string) => {
    if (mode === 'client') {
      setInvoicePick({ type: 'client', id });
      router.back();
      return;
    }
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id],
    );
  };

  return (
    <SettingsScroll>
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={mode === 'client' ? 'Search clients' : 'Search catalogue'}
        autoFocus
      />

      <View style={{ marginTop: space.lg, marginBottom: space.xl }}>
        {rows.length === 0 ? (
          <Text variant="body" muted style={{ marginLeft: space.md }}>
            {q ? `No matches for “${query.trim()}”` : 'Nothing to pick yet.'}
          </Text>
        ) : (
          <SettingsGroup title={mode === 'client' ? 'Clients' : 'Catalogue'}>
            {rows.map((row, index) => {
              const selected = picked.includes(row.id);
              return (
                <Pressable
                  key={row.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => toggle(row.id)}
                  style={[
                    styles.row,
                    {
                      paddingHorizontal: space.lg,
                      paddingVertical: space.md,
                      borderBottomWidth:
                        index === rows.length - 1
                          ? 0
                          : StyleSheet.hairlineWidth,
                      borderBottomColor: colors.background,
                    },
                  ]}
                >
                  {mode === 'catalogue' ? (
                    <Icon
                      name={
                        selected ? 'check-box' : 'check-box-outline-blank'
                      }
                      size={22}
                      color={selected ? colors.primary : colors.onSurfaceMuted}
                      style={{ marginRight: space.md }}
                    />
                  ) : null}
                  <View style={styles.copy}>
                    <Text
                      variant="body"
                      style={{ fontWeight: '600' }}
                      numberOfLines={1}
                    >
                      {row.title}
                    </Text>
                    {row.subtitle ? (
                      <Text variant="caption" muted numberOfLines={2}>
                        {row.subtitle}
                      </Text>
                    ) : null}
                  </View>
                  {mode === 'client' ? (
                    <Icon
                      name="chevron-right"
                      size={18}
                      color={colors.onSurfaceMuted}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </SettingsGroup>
        )}
      </View>
    </SettingsScroll>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
});
