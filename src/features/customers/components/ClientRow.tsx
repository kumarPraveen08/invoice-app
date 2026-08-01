import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text, useTheme } from '@/shared/design-system';
import { ActionSheet, showSnackbar, SwipeableRow } from '@/shared/ui';
import { useClientsStore } from '../store';
import type { Client } from '../types';

type Props = {
  client: Client;
  last?: boolean;
};

export function ClientRow({ client, last = false }: Props) {
  const { colors, radii, space } = useTheme();
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
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: colors.iconSoft,
                borderRadius: radii.full,
                marginRight: space.md,
              },
            ]}
          >
            <Ionicons name="person-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.copy}>
            <Text variant="body" style={{ fontWeight: '600' }} numberOfLines={1}>
              {client.name}
            </Text>
            <Text variant="caption" muted numberOfLines={1}>
              {client.businessName}
              {client.phone ? ` · ${client.phone}` : ''}
            </Text>
          </View>
        </Pressable>
      </SwipeableRow>

      <ActionSheet
        visible={actionsOpen}
        onClose={() => setActionsOpen(false)}
        title={client.name}
        actions={[
          {
            key: 'view',
            label: 'View',
            icon: 'eye-outline',
            onPress: onOpen,
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: 'create-outline',
            onPress: onEdit,
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: 'trash-outline',
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
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
});
