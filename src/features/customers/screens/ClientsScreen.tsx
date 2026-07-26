import { useColorScheme, View } from 'react-native';
import { colors } from '@/shared/constants';
import { EmptyState, FloatingAddButton } from '@/shared/ui';

export default function ClientsScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = colors[scheme];

  const onCreate = () => {
    // TODO: navigate to add client
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBg }}>
      <EmptyState
        icon="people-outline"
        title="No clients yet"
        description="Add clients so you can create invoices and estimates faster."
        actionLabel="Add Client"
        onAction={onCreate}
      />
      <FloatingAddButton
        onPress={onCreate}
        accessibilityLabel="Add client"
      />
    </View>
  );
}
