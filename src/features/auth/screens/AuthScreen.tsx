import { StyleSheet, View } from "react-native";
import { Screen, Text, useTheme } from "@/shared/design-system";
import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";

export default function AuthScreen() {
  const { colors, space } = useTheme();

  return (
    <Screen>
      <View style={styles.container}>
        <Text
          variant="caption"
          muted
          style={{ marginBottom: space.md, fontSize: 14 }}
        >
          Sign in
        </Text>
        <Text
          style={{
            color: colors.onSurface,
            fontSize: 34,
            lineHeight: 40,
            fontWeight: "800",
            letterSpacing: -0.8,
            marginBottom: space.sm,
            textAlign: "center",
          }}
        >
          Continue with Google
        </Text>
        <Text
          style={{
            color: colors.onSurfaceMuted,
            fontSize: 18,
            lineHeight: 26,
            fontWeight: "500",
            textAlign: "center",
            marginBottom: space["2xl"],
          }}
        >
          Password auth is disabled. Use your Google account to open the app.
        </Text>

        <GoogleSignInButton />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
