import { Text, useColorScheme, View } from 'react-native';
import { colors } from '@/shared/constants';

export default function ToolsScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = colors[scheme];

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.screenBg,
      }}
    >
      <Text style={{ color: theme.text }}>Tools</Text>
    </View>
  );
}
