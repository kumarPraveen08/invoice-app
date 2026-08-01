import { useState } from 'react';
import { Alert, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Button, Text, useTheme } from '@/shared/design-system';
import {
  SettingsGroup,
  SettingsRow,
} from '@/features/settings/components/SettingsList';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import { useCatalogueStore } from '@/features/catalogue/store';
import type { CatalogueItem } from '@/features/catalogue/types';
import { useClientsStore } from '@/features/customers/store';
import type { Client } from '@/features/customers/types';
import { parseCsv, toCsv } from '@/shared/lib/csv';
import { readPickedText, shareTextFile } from '@/shared/lib/files';
import { createId } from '@/shared/lib/id';

type Props = {
  kind: 'catalogue' | 'clients';
};

const COPY = {
  catalogue: {
    columns: 'Name, SKU, Category, Selling price, Unit',
    templateName: 'catalogue-template.csv',
    templateRows: [['Name', 'SKU', 'Category', 'Selling price', 'Unit']],
    tip: 'Duplicate SKUs in the file are skipped. Existing SKUs in the app are also skipped.',
  },
  clients: {
    columns: 'Customer name, Business name, Phone, Email',
    templateName: 'clients-template.csv',
    templateRows: [['Customer name', 'Business name', 'Phone', 'Email']],
    tip: 'Duplicate emails in the file or app are skipped.',
  },
} as const;

function parseCatalogueRows(rows: string[][]): {
  items: CatalogueItem[];
  skipped: number;
  errors: string[];
} {
  const existing = new Set(
    useCatalogueStore.getState().items.map((item) => item.sku.toLowerCase()),
  );
  const seen = new Set<string>();
  const items: CatalogueItem[] = [];
  const errors: string[] = [];
  let skipped = 0;

  rows.slice(1).forEach((row, index) => {
    const [name, sku, category, priceRaw, unit] = row;
    const line = index + 2;
    if (!name?.trim() || !sku?.trim()) {
      errors.push(`Line ${line}: name and SKU are required.`);
      return;
    }
    const key = sku.trim().toLowerCase();
    if (seen.has(key) || existing.has(key)) {
      skipped += 1;
      return;
    }
    const price = Number(priceRaw);
    if (!Number.isFinite(price)) {
      errors.push(`Line ${line}: invalid price “${priceRaw ?? ''}”.`);
      return;
    }
    seen.add(key);
    items.push({
      id: createId('item'),
      name: name.trim(),
      sku: sku.trim(),
      category: (category || 'General').trim(),
      price,
      unit: (unit || 'unit').trim(),
    });
  });

  return { items, skipped, errors };
}

function parseClientRows(rows: string[][]): {
  clients: Client[];
  skipped: number;
  errors: string[];
} {
  const existing = new Set(
    useClientsStore
      .getState()
      .clients.map((client) => client.email.toLowerCase())
      .filter(Boolean),
  );
  const seen = new Set<string>();
  const clients: Client[] = [];
  const errors: string[] = [];
  let skipped = 0;

  rows.slice(1).forEach((row, index) => {
    const [name, businessName, phone, email] = row;
    const line = index + 2;
    if (!name?.trim()) {
      errors.push(`Line ${line}: customer name is required.`);
      return;
    }
    const emailKey = (email || '').trim().toLowerCase();
    if (emailKey && (seen.has(emailKey) || existing.has(emailKey))) {
      skipped += 1;
      return;
    }
    if (emailKey) seen.add(emailKey);
    clients.push({
      id: createId('client'),
      name: name.trim(),
      businessName: (businessName || '').trim(),
      phone: (phone || '').trim(),
      email: (email || '').trim(),
    });
  });

  return { clients, skipped, errors };
}

export function BulkImportGuide({ kind }: Props) {
  const { space } = useTheme();
  const copy = COPY[kind];
  const addItems = useCatalogueStore((s) => s.addItems);
  const addClients = useClientsStore((s) => s.addClients);
  const [busy, setBusy] = useState(false);

  const downloadTemplate = async () => {
    try {
      await shareTextFile(
        copy.templateName,
        toCsv([...(copy.templateRows as unknown as string[][])]),
        'text/csv',
      );
    } catch (error) {
      Alert.alert(
        'Could not share template',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  };

  const uploadCsv = async () => {
    try {
      setBusy(true);
      const picked = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'public.comma-separated-values-text', '*/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (picked.canceled || !picked.assets?.[0]) return;

      const text = await readPickedText(picked.assets[0].uri);
      const rows = parseCsv(text);
      if (rows.length < 2) {
        Alert.alert('Empty file', 'Add a header row and at least one data row.');
        return;
      }

      if (kind === 'catalogue') {
        const { items, skipped, errors } = parseCatalogueRows(rows);
        if (items.length) addItems(items);
        Alert.alert(
          'Import complete',
          `Imported ${items.length}. Skipped ${skipped}.${
            errors.length ? `\n\n${errors.slice(0, 5).join('\n')}` : ''
          }`,
        );
        return;
      }

      const { clients, skipped, errors } = parseClientRows(rows);
      if (clients.length) addClients(clients);
      Alert.alert(
        'Import complete',
        `Imported ${clients.length}. Skipped ${skipped}.${
          errors.length ? `\n\n${errors.slice(0, 5).join('\n')}` : ''
        }`,
      );
    } catch (error) {
      Alert.alert(
        'Import failed',
        error instanceof Error ? error.message : 'Unknown error',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsScroll>
      <Text variant="body" muted style={{ marginBottom: space['2xl'] }}>
        Download a template, fill rows, then upload the CSV. Invalid rows are
        reported; duplicates are skipped.
      </Text>

      <SettingsGroup title="Required columns">
        <SettingsRow
          icon="list-outline"
          title="CSV headers"
          subtitle={copy.columns}
          showChevron={false}
          last
        />
      </SettingsGroup>

      <View style={{ gap: space.md, marginBottom: space['2xl'] }}>
        <Button
          label="Download template"
          icon="download-outline"
          variant="secondary"
          onPress={downloadTemplate}
          disabled={busy}
        />
        <Button
          label={busy ? 'Importing…' : 'Upload CSV'}
          icon="document-attach-outline"
          onPress={uploadCsv}
          disabled={busy}
        />
      </View>

      <Text variant="caption" muted style={{ marginLeft: space.md }}>
        {copy.tip}
      </Text>
    </SettingsScroll>
  );
}
