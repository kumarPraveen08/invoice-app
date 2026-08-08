import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text, useTheme } from '@/shared/design-system';
import { ActionSheet, showSnackbar, SwipeableRow } from '@/shared/ui';
import { useClientsStore } from '../store';
import type { Client } from '../types';
import { ClientAvatar } from './ClientAvatar';

type Props = {
  client: Client;
  last?: boolean;
};

export function ClientRow({ client, last = false }: Props) {
  const { colors, space } = useTheme();
  const removeClient = useClientsStore((s) => s.removeClient);
  const upsertClient = useClientsStore((s) => s.upsertClient);
  const [actionsOpen, setActionsOpen] = useState(false);

  const onOpen = () => router.push(`/clients/${client.id}`);
  const onEdit = () => {
    router.push({ pathname: '/clients/new', params: { id: client.id } });
  };
  const onDelete = () => {
    const snapshot = client;
    removeClient(client.id);
    showSnackbar('Client deleted', {
      action: {
        label: 'Undo',
        onPress: () => upsertClient(snapshot),
      },
    });
  };

  const subtitle = [client.businessName, client.address || client.phone]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <SwipeableRow onEdit={onEdit} onDelete={onDelete}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${client.name}`}
          onPress={onOpen}
          onLongPress={() => setActionsOpen(true)}
          delayLongPress={280}
          style={[
            styles.row,
            {
              backgroundColor: colors.surface,
              paddingHorizontal: space.lg,
              paddingVertical: space.md,
              borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
              borderBottomColor: colors.background,
            },
          ]}
        >
          <View style={{ marginRight: space.md }}>
            <ClientAvatar
              name={client.name}
              imageUri={client.profileImageUri}
            />
          </View>
          <View style={styles.copy}>
            <Text variant="body" style={{ fontWeight: '600' }} numberOfLines={1}>
              {client.name}
            </Text>
            <Text variant="caption" muted numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </Pressable>
      </SwipeableRow>

      <ActionSheet
        visible={actionsOpen}
        onClose={() => setActionsOpen(false)}
        title={client.name}
        subtitle={subtitle || undefined}
        actions={[
          {
            key: 'view',
            label: 'View',
            icon: 'visibility',
            onPress: onOpen,
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: 'edit',
            onPress: onEdit,
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: 'delete',
            destructive: true,
            onPress: onDelete,
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
});
