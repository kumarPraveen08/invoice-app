import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button, Text, useTheme } from '@/shared/design-system';
import { createId } from '@/shared/lib/id';
import { showSnackbar } from '@/shared/ui';
import { SettingsField } from '@/features/settings/components/SettingsField';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import { useClientsStore } from '../store';
import { ClientAvatar } from '../components/ClientAvatar';

function formatAddress(parts: {
  street?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
}): string {
  return [parts.street, parts.city, parts.region, parts.postalCode, parts.country]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(', ');
}

export default function NewClientScreen() {
  const { colors, space } = useTheme();
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
  const [address, setAddress] = useState(existing?.address ?? '');
  const [profileImageUri, setProfileImageUri] = useState<string | null>(
    existing?.profileImageUri ?? null,
  );
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: editing ? 'Edit client' : 'New client',
    });
  }, [editing, navigation]);

  const pickPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showSnackbar('Allow photo access in Settings to add a profile image.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]?.uri) return;
      setProfileImageUri(result.assets[0].uri);
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : 'Could not open photos.',
      );
    }
  };

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
      const postal = contact.addresses?.[0];
      const nextAddress = postal
        ? formatAddress({
            street: postal.street,
            city: postal.city,
            region: postal.region,
            postalCode: postal.postalCode,
            country: postal.country,
          })
        : '';
      const nextImage =
        contact.image?.uri ?? contact.rawImage?.uri ?? null;

      if (!nextName && !nextBusiness && !nextEmail && !nextPhone) {
        showSnackbar('That contact has no name, phone, or email.');
        return;
      }

      setName(nextName || nextBusiness);
      setBusinessName(nextBusiness || nextName);
      setEmail(nextEmail);
      setPhone(nextPhone);
      if (nextAddress) setAddress(nextAddress);
      if (nextImage) setProfileImageUri(nextImage);
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
      address: address.trim() || undefined,
      profileImageUri,
    });
    router.back();
  };

  return (
    <SettingsScroll>
      <View style={[styles.photoRow, { marginBottom: space.xl }]}>
        <ClientAvatar name={name || 'Client'} imageUri={profileImageUri} size={64} />
        <View style={{ flex: 1, gap: space.sm }}>
          <Button
            label={profileImageUri ? 'Change photo' : 'Add photo'}
            variant="secondary"
            onPress={pickPhoto}
            style={{ alignSelf: 'stretch', justifyContent: 'center' }}
          />
          {profileImageUri ? (
            <Pressable onPress={() => setProfileImageUri(null)} hitSlop={8}>
              <Text variant="caption" style={{ color: colors.onSurfaceMuted }}>
                Remove photo
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>

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
        label="Address"
        value={address}
        onChangeText={setAddress}
        placeholder="Street, city, state, ZIP"
        multiline
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

const styles = StyleSheet.create({
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
