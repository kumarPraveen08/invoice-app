import { useEffect, useMemo, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { format, addDays } from 'date-fns';
import { createId } from '@/shared/lib/id';
import { Button, Text, useTheme } from '@/shared/design-system';
import { useCatalogueStore } from '@/features/catalogue';
import { useClientsStore } from '@/features/customers';
import { SettingsField } from '@/features/settings/components/SettingsField';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import { useSettingsStore } from '@/features/settings';
import { SearchablePickerSheet } from '@/shared/ui';
import { computeInvoiceTotals, formatMoney } from '../format';
import { useInvoicesStore } from '../store';
import type { Invoice, InvoiceLine, InvoiceStatus } from '../types';

type LineDraft = {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
};

function todayIso() {
  return format(new Date(), 'yyyy-MM-dd');
}

function defaultDueIso() {
  return format(addDays(new Date(), 14), 'yyyy-MM-dd');
}

function emptyLine(): LineDraft {
  return { id: createId('line'), name: '', quantity: '1', unitPrice: '' };
}

function toLineDrafts(lines: InvoiceLine[]): LineDraft[] {
  return lines.map((line) => ({
    id: line.id,
    name: line.name,
    quantity: String(line.quantity),
    unitPrice: String(line.unitPrice),
  }));
}

function parseAmount(value: string): number {
  const n = Number(value.replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : NaN;
}

function issuedStatusFor(dueDate: string): InvoiceStatus {
  const today = todayIso();
  return dueDate < today ? 'overdue' : 'sent';
}

function CompactInput({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  style,
  ...rest
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'decimal-pad';
  style?: object;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  const { colors } = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.onSurfaceMuted}
      keyboardType={keyboardType}
      autoCorrect={false}
      style={[
        {
          color: colors.onSurface,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.onSurfaceMuted,
          fontSize: 15,
          paddingVertical: 6,
          paddingHorizontal: 0,
        },
        style,
      ]}
      {...rest}
    />
  );
}

export default function NewInvoiceScreen() {
  const { space, colors, radii } = useTheme();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useInvoicesStore((s) =>
    id ? s.invoices.find((row) => row.id === id) : undefined,
  );
  const invoices = useInvoicesStore((s) => s.invoices);
  const upsertInvoice = useInvoicesStore((s) => s.upsertInvoice);
  const clients = useClientsStore((s) => s.clients);
  const catalogue = useCatalogueStore((s) => s.items);
  const preferences = useSettingsStore((s) => s.preferences);
  const invoiceDefaults = useSettingsStore((s) => s.invoiceDefaults);
  const bank = useSettingsStore((s) => s.bank);
  const updatePreferences = useSettingsStore((s) => s.updatePreferences);
  const editing = Boolean(existing);
  const currency = preferences.currency;

  const [customerName, setCustomerName] = useState(
    existing?.customerName ?? '',
  );
  const [number, setNumber] = useState(
    existing?.number ??
      `${preferences.invoicePrefix}${preferences.invoiceNextNumber}`,
  );
  const [issueDate, setIssueDate] = useState(
    existing?.issueDate ?? todayIso(),
  );
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? defaultDueIso());
  const [lines, setLines] = useState<LineDraft[]>(
    existing?.lines?.length ? toLineDrafts(existing.lines) : [],
  );
  const [discount, setDiscount] = useState(
    existing ? String(existing.discount) : '0',
  );
  const [taxRate, setTaxRate] = useState(
    existing ? String(existing.taxRate) : preferences.taxRate,
  );
  const [additionalCharges, setAdditionalCharges] = useState(
    existing ? String(existing.additionalCharges) : '0',
  );
  const [notes, setNotes] = useState(
    existing?.notes ?? invoiceDefaults.notes,
  );
  const [terms, setTerms] = useState(
    existing?.terms ?? invoiceDefaults.terms,
  );
  const [paymentInstructions, setPaymentInstructions] = useState(
    existing?.paymentInstructions ?? bank.paymentInstructions,
  );
  const [clientOpen, setClientOpen] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: editing ? 'Edit invoice' : 'New invoice',
    });
  }, [editing, navigation]);

  const clientOptions = useMemo(
    () =>
      clients.map((client) => ({
        id: client.id,
        title: client.businessName || client.name,
        subtitle: client.businessName
          ? `${client.name}${client.phone ? ` · ${client.phone}` : ''}`
          : client.phone || client.email || undefined,
      })),
    [clients],
  );

  const catalogueOptions = useMemo(
    () =>
      catalogue.map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: `${item.sku} · ${formatMoney(item.price, currency)}`,
      })),
    [catalogue, currency],
  );

  const parsedLines = lines.map((line) => ({
    id: line.id,
    name: line.name.trim(),
    quantity: parseAmount(line.quantity),
    unitPrice: parseAmount(line.unitPrice),
  }));

  const totals = computeInvoiceTotals({
    lines: parsedLines.map((line) => ({
      quantity: Number.isFinite(line.quantity) ? line.quantity : 0,
      unitPrice: Number.isFinite(line.unitPrice) ? line.unitPrice : 0,
    })),
    discount: Number.isFinite(parseAmount(discount))
      ? parseAmount(discount)
      : 0,
    taxRate: Number.isFinite(parseAmount(taxRate)) ? parseAmount(taxRate) : 0,
    additionalCharges: Number.isFinite(parseAmount(additionalCharges))
      ? parseAmount(additionalCharges)
      : 0,
  });

  const updateLine = (lineId: string, patch: Partial<LineDraft>) => {
    setLines((prev) =>
      prev.map((line) => (line.id === lineId ? { ...line, ...patch } : line)),
    );
  };

  const removeLine = (lineId: string) => {
    setLines((prev) => prev.filter((line) => line.id !== lineId));
  };

  const addCatalogueItems = (ids: string[]) => {
    const next = ids
      .map((itemId) => catalogue.find((row) => row.id === itemId))
      .filter(Boolean)
      .map((item) => ({
        id: createId('line'),
        name: item!.name,
        quantity: '1',
        unitPrice: String(item!.price),
      }));
    if (next.length === 0) return;
    setLines((prev) => [...prev, ...next]);
  };

  const buildInvoice = (status: InvoiceStatus): Invoice | null => {
    const trimmedCustomer = customerName.trim();
    const trimmedNumber = number.trim();
    if (!trimmedCustomer) {
      Alert.alert('Customer required', 'Select or enter a customer.');
      return null;
    }
    if (!trimmedNumber) {
      Alert.alert('Invoice number required', 'Enter an invoice number.');
      return null;
    }
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(issueDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)
    ) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD for issue and due dates.');
      return null;
    }

    const taken = invoices.some(
      (row) => row.number === trimmedNumber && row.id !== existing?.id,
    );
    if (taken) {
      Alert.alert('Number in use', 'That invoice number already exists.');
      return null;
    }

    if (parsedLines.length === 0) {
      Alert.alert('Items required', 'Add at least one line item.');
      return null;
    }

    const validLines: InvoiceLine[] = [];
    for (const line of parsedLines) {
      if (!line.name) {
        Alert.alert('Item name required', 'Every line needs a name.');
        return null;
      }
      if (!Number.isFinite(line.quantity) || line.quantity <= 0) {
        Alert.alert('Invalid quantity', 'Quantity must be greater than zero.');
        return null;
      }
      if (!Number.isFinite(line.unitPrice) || line.unitPrice < 0) {
        Alert.alert('Invalid price', 'Enter a valid unit price.');
        return null;
      }
      validLines.push({
        id: line.id,
        name: line.name,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      });
    }

    const discountValue = parseAmount(discount);
    const taxRateValue = parseAmount(taxRate);
    const chargesValue = parseAmount(additionalCharges);
    if (
      !Number.isFinite(discountValue) ||
      discountValue < 0 ||
      !Number.isFinite(taxRateValue) ||
      taxRateValue < 0 ||
      !Number.isFinite(chargesValue) ||
      chargesValue < 0
    ) {
      Alert.alert(
        'Invalid amounts',
        'Discount, tax, and charges must be valid.',
      );
      return null;
    }

    const nextTotals = computeInvoiceTotals({
      lines: validLines,
      discount: discountValue,
      taxRate: taxRateValue,
      additionalCharges: chargesValue,
    });
    if (nextTotals.total < 0) {
      Alert.alert('Invalid total', 'Invoice total cannot be negative.');
      return null;
    }

    const paid =
      existing?.status === 'paid'
        ? nextTotals.total
        : Math.min(existing?.paid ?? 0, nextTotals.total);

    return {
      id: existing?.id ?? createId('inv'),
      number: trimmedNumber,
      customerName: trimmedCustomer,
      issueDate,
      dueDate,
      lines: validLines,
      discount: nextTotals.discount,
      taxRate: taxRateValue,
      additionalCharges: nextTotals.additionalCharges,
      notes: notes.trim(),
      terms: terms.trim(),
      paymentInstructions: paymentInstructions.trim(),
      total: nextTotals.total,
      paid: status === 'paid' ? nextTotals.total : paid,
      status,
    };
  };

  const save = (status: InvoiceStatus) => {
    const invoice = buildInvoice(status);
    if (!invoice) return;

    upsertInvoice(invoice);

    if (!editing) {
      const current = Number(preferences.invoiceNextNumber);
      if (Number.isFinite(current)) {
        updatePreferences({ invoiceNextNumber: String(current + 1) });
      }
    }

    router.back();
  };

  const summaryRows = [
    {
      key: 'items',
      label: 'Items',
      value: formatMoney(totals.subtotal, currency),
    },
    {
      key: 'discount',
      label: 'Discount',
      value: `−${formatMoney(totals.discount, currency)}`,
    },
    {
      key: 'tax',
      label: `Tax (${taxRate || '0'}%)`,
      value: formatMoney(totals.tax, currency),
    },
    {
      key: 'extra',
      label: 'Extra charges',
      value: formatMoney(totals.additionalCharges, currency),
    },
  ];

  return (
    <SettingsScroll>
      {clients.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select customer"
          onPress={() => setClientOpen(true)}
          style={[
            styles.pickerField,
            {
              marginBottom: space.xl,
              borderBottomColor: colors.onSurfaceMuted,
            },
          ]}
        >
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text variant="caption" muted style={styles.fieldLabel}>
              Customer
            </Text>
            <Text
              variant="body"
              numberOfLines={1}
              style={{
                color: customerName ? colors.onSurface : colors.onSurfaceMuted,
              }}
            >
              {customerName || 'Search and select a client'}
            </Text>
          </View>
          <Ionicons
            name="chevron-down"
            size={18}
            color={colors.onSurfaceMuted}
          />
        </Pressable>
      ) : (
        <SettingsField
          label="Customer"
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Northwind Studio"
          autoCapitalize="words"
        />
      )}

      <SettingsField
        label="Invoice number"
        value={number}
        onChangeText={setNumber}
        placeholder="INV-1001"
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <View style={[styles.dateRow, { gap: space.md, marginBottom: space.xl }]}>
        <View style={{ flex: 1 }}>
          <Text variant="caption" muted style={styles.fieldLabel}>
            Issue date
          </Text>
          <CompactInput
            value={issueDate}
            onChangeText={setIssueDate}
            placeholder="YYYY-MM-DD"
            autoCapitalize="none"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="caption" muted style={styles.fieldLabel}>
            Due date
          </Text>
          <CompactInput
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="YYYY-MM-DD"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={[styles.sectionHead, { marginBottom: space.sm }]}>
        <Text variant="subtitle">Items</Text>
        <Text variant="caption" muted>
          {lines.length} line{lines.length === 1 ? '' : 's'}
        </Text>
      </View>

      {lines.length === 0 ? (
        <Text
          variant="body"
          muted
          style={{ marginBottom: space.md, marginTop: space.xs }}
        >
          Add products from catalogue or a blank line.
        </Text>
      ) : (
        <View
          style={[
            styles.linesWrap,
            {
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              marginBottom: space.md,
            },
          ]}
        >
          {lines.map((line, index) => {
            const qty = parseAmount(line.quantity);
            const price = parseAmount(line.unitPrice);
            const amount =
              Number.isFinite(qty) && Number.isFinite(price) ? qty * price : 0;
            return (
              <View
                key={line.id}
                style={[
                  styles.lineRow,
                  {
                    paddingHorizontal: space.md,
                    paddingVertical: space.sm,
                    borderBottomWidth:
                      index === lines.length - 1 ? 0 : StyleSheet.hairlineWidth,
                    borderBottomColor: colors.background,
                  },
                ]}
              >
                <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
                  <View style={styles.lineTop}>
                    <CompactInput
                      value={line.name}
                      onChangeText={(name) => updateLine(line.id, { name })}
                      placeholder="Item name"
                      autoCapitalize="sentences"
                      style={{ flex: 1 }}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Remove line"
                      onPress={() => removeLine(line.id)}
                      hitSlop={8}
                      style={{ paddingLeft: 8, paddingTop: 4 }}
                    >
                      <Ionicons
                        name="close"
                        size={18}
                        color={colors.onSurfaceMuted}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.lineMeta}>
                    <CompactInput
                      value={line.quantity}
                      onChangeText={(quantity) =>
                        updateLine(line.id, { quantity })
                      }
                      placeholder="Qty"
                      keyboardType="decimal-pad"
                      style={{ width: 56, textAlign: 'center' }}
                    />
                    <Text variant="caption" muted>
                      ×
                    </Text>
                    <CompactInput
                      value={line.unitPrice}
                      onChangeText={(unitPrice) =>
                        updateLine(line.id, { unitPrice })
                      }
                      placeholder="Price"
                      keyboardType="decimal-pad"
                      style={{ width: 88 }}
                    />
                    <Text
                      variant="caption"
                      style={{
                        flex: 1,
                        textAlign: 'right',
                        fontWeight: '600',
                        color: colors.onSurface,
                      }}
                      numberOfLines={1}
                    >
                      {formatMoney(amount, currency)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View style={[styles.addRow, { gap: space.sm, marginBottom: space.xl }]}>
        {catalogue.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setCatalogueOpen(true)}
            style={[
              styles.addChip,
              {
                backgroundColor: colors.iconSoft,
                borderRadius: radii.full,
                flex: 1,
              },
            ]}
          >
            <Ionicons name="grid-outline" size={16} color={colors.primary} />
            <Text
              variant="caption"
              style={{ color: colors.primary, fontWeight: '600' }}
            >
              Catalogue
            </Text>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={() => setLines((prev) => [...prev, emptyLine()])}
          style={[
            styles.addChip,
            {
              backgroundColor: colors.iconSoft,
              borderRadius: radii.full,
              flex: 1,
            },
          ]}
        >
          <Ionicons name="add" size={16} color={colors.primary} />
          <Text
            variant="caption"
            style={{ color: colors.primary, fontWeight: '600' }}
          >
            Blank line
          </Text>
        </Pressable>
      </View>

      <Text variant="subtitle" style={{ marginBottom: space.md }}>
        Adjustments
      </Text>
      <View style={[styles.adjustRow, { gap: space.md, marginBottom: space.xl }]}>
        <View style={{ flex: 1 }}>
          <Text variant="caption" muted style={styles.fieldLabel}>
            Discount
          </Text>
          <CompactInput
            value={discount}
            onChangeText={setDiscount}
            placeholder="0"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="caption" muted style={styles.fieldLabel}>
            Tax %
          </Text>
          <CompactInput
            value={taxRate}
            onChangeText={setTaxRate}
            placeholder="18"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="caption" muted style={styles.fieldLabel}>
            Extra
          </Text>
          <CompactInput
            value={additionalCharges}
            onChangeText={setAdditionalCharges}
            placeholder="0"
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <SettingsField
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        placeholder="Thank you for your business."
        multiline
      />
      <SettingsField
        label="Terms and conditions"
        value={terms}
        onChangeText={setTerms}
        placeholder="Payment due within 15 days."
        multiline
      />
      <SettingsField
        label="Payment instructions"
        value={paymentInstructions}
        onChangeText={setPaymentInstructions}
        placeholder="Pay to business bank account."
        multiline
      />

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.surface,
            borderRadius: radii.lg,
            padding: space.lg,
            marginBottom: space.xl,
          },
        ]}
      >
        <Text variant="subtitle" style={{ marginBottom: space.md }}>
          Amount due
        </Text>
        {summaryRows.map((row) => (
          <View key={row.key} style={styles.summaryRow}>
            <Text variant="body" muted>
              {row.label}
            </Text>
            <Text variant="body">{row.value}</Text>
          </View>
        ))}
        <View
          style={[
            styles.summaryTotal,
            {
              borderTopColor: colors.background,
              marginTop: space.sm,
              paddingTop: space.md,
            },
          ]}
        >
          <Text variant="body" style={{ fontWeight: '700' }}>
            Customer pays
          </Text>
          <Text variant="title" style={{ fontWeight: '700' }}>
            {formatMoney(totals.total, currency)}
          </Text>
        </View>
      </View>

      {editing ? (
        <Button
          label="Save changes"
          onPress={() => save(existing?.status ?? 'draft')}
          style={styles.primaryAction}
        />
      ) : (
        <View style={{ gap: space.sm }}>
          <Button
            label="Save & send"
            icon="send-outline"
            onPress={() => save(issuedStatusFor(dueDate))}
            style={styles.primaryAction}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => save('draft')}
            style={styles.draftAction}
          >
            <Text
              variant="body"
              style={{ color: colors.primary, fontWeight: '600' }}
            >
              Save as draft
            </Text>
          </Pressable>
        </View>
      )}

      <SearchablePickerSheet
        visible={clientOpen}
        onClose={() => setClientOpen(false)}
        title="Select client"
        searchPlaceholder="Search clients"
        options={clientOptions}
        onSelect={(ids) => {
          const client = clients.find((row) => row.id === ids[0]);
          if (!client) return;
          setCustomerName(client.businessName || client.name);
        }}
      />

      <SearchablePickerSheet
        visible={catalogueOpen}
        onClose={() => setCatalogueOpen(false)}
        title="Add from catalogue"
        searchPlaceholder="Search catalogue"
        options={catalogueOptions}
        multiple
        confirmLabel="Add items"
        onSelect={addCatalogueItems}
      />
    </SettingsScroll>
  );
}

const styles = StyleSheet.create({
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 10,
  },
  fieldLabel: {
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  linesWrap: {
    overflow: 'hidden',
  },
  lineRow: {},
  lineTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addRow: {
    flexDirection: 'row',
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  adjustRow: {
    flexDirection: 'row',
  },
  summaryCard: {},
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  primaryAction: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  draftAction: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
