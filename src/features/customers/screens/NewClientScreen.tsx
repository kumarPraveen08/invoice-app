import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Button, useTheme } from '@/shared/design-system';
import { createId } from '@/shared/lib/id';
import { showSnackbar } from '@/shared/ui';
import { SettingsField } from '@/features/settings/components/SettingsField';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import { useClientsStore } from '../store';

export default function NewClientScreen() {
  const { space } = useTheme();
  const navigation = useNavigation();
  const { id, from } = useLocalSearchParams<{ id?: string; from?: string }>();
  const existing = useClientsStore((s) =>
    id ? s.clients.find((row) => row.id === id) : undefined,
  );
  const upsertClient = useClientsStore((s) => s.upsertClient);
  const editing = Boolean(id);

  const [name, setName] = useState(existing?.name ?? '');
  const [businessName, setBusinessName] = useState(existing?.businessName ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: editing ? 'Edit client' : 'New client',
    });
  }, [editing, navigation]);

  const importFromContacts = async () => {
    try {
      const Contacts = await import('expo-contacts/legacy');
      const current = await Contacts.getPermissionsAsync();
      let status = current.status;
      if (status !== 'granted') {
        const requested = await Contacts.requestPermissionsAsync();
        status = requested.status;
      }
      if (status !== 'granted') {
        showSnackbar('Allow contacts access in Settings to import a client.');
        return;
      }

      const contact = await Contacts.presentContactPickerAsync();
      if (!contact) return;

      const nextName = contact.name?.trim() ?? '';
      const nextBusiness = contact.company?.trim() ?? '';
      const nextEmail =
        contact.emails?.find((item) => item.email)?.email?.trim() ?? '';
      const nextPhone =
        contact.phoneNumbers?.find((item) => item.number)?.number?.trim() ??
        '';

      if (!nextName && !nextBusiness && !nextEmail && !nextPhone) {
        showSnackbar('That contact has no name, phone, or email.');
        return;
      }

      setName(nextName || nextBusiness);
      setBusinessName(nextBusiness || nextName);
      setEmail(nextEmail);
      setPhone(nextPhone);
      setNameError('');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not open contacts.';
      const needsRebuild =
        /ExpoContacts|native module/i.test(message) ||
        message.includes('Cannot find native module');
      showSnackbar(
        Platform.OS === 'web'
          ? 'Contact import is not available on web.'
          : needsRebuild
            ? 'Rebuild the app to enable contacts (pnpm android).'
            : message,
      );
    }
  };

  useEffect(() => {
    if (editing || from !== 'contacts') return;
    void importFromContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, from]);

  const onSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Enter a client name.');
      return;
    }
    setNameError('');
    upsertClient({
      id: existing?.id ?? createId('client'),
      name: trimmedName,
      businessName: businessName.trim() || trimmedName,
      email: email.trim(),
      phone: phone.trim(),
    });
    router.back();
  };

  return (
    <SettingsScroll>
      {!editing ? (
        <Button
          label="Add from contacts"
          variant="secondary"
          icon="people-outline"
          onPress={importFromContacts}
          style={{
            marginBottom: space.xl,
            alignSelf: 'stretch',
            justifyContent: 'center',
          }}
        />
      ) : null}
      <SettingsField
        label="Customer name"
        value={name}
        onChangeText={(value) => {
          setName(value);
          if (nameError) setNameError('');
        }}
        placeholder="Aisha Khan"
        autoCapitalize="words"
        error={nameError}
      />
      <SettingsField
        label="Business name"
        value={businessName}
        onChangeText={setBusinessName}
        placeholder="Northwind Studio"
        autoCapitalize="words"
      />
      <SettingsField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="aisha@northwind.co"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <SettingsField
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholder="+91 98765 41001"
        keyboardType="phone-pad"
      />
      <Button
        label={editing ? 'Save changes' : 'Add client'}
        onPress={onSave}
        style={{
          marginTop: space.sm,
          alignSelf: 'stretch',
          justifyContent: 'center',
        }}
      />
    </SettingsScroll>
  );
}
