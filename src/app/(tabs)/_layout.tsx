import { useState } from "react";
import { router, Tabs } from "expo-router";
import { View } from "react-native";
import { MoreCreateSheet } from "@/features/invoices/components/MoreCreateSheet";
import { useTheme, type IconName } from "@/shared/design-system";
import {
  DeferredMount,
  FloatingTabBar,
  HeaderActionRow,
  HeaderIconButton,
  headerIconContainerStyle,
} from "@/shared/ui";

const CREATE_PATH: Record<
  string,
  "/invoice/new" | "/catalogue/new" | "/clients/new"
> = {
  index: "/invoice/new",
  catalogue: "/catalogue/new",
  clients: "/clients/new",
};

export default function TabsLayout() {
  const { colors } = useTheme();
  const [moreOpen, setMoreOpen] = useState(false);
  const iconColor = colors.onSurface;

  const onFabPress = (routeName: string) => {
    const path = CREATE_PATH[routeName];
    if (path) router.push(path);
  };

  const action = (name: IconName, label: string, onPress: () => void) => (
    <HeaderIconButton
      name={name}
      label={label}
      onPress={onPress}
      color={iconColor}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        tabBar={(props) => (
          <FloatingTabBar
            {...props}
            onFabPress={onFabPress}
            onMorePress={() => setMoreOpen(true)}
          />
        )}
        screenLayout={({ children, route }) =>
          route.name === "index" ? (
            children
          ) : (
            <DeferredMount>{children}</DeferredMount>
          )
        }
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.onSurface,
          sceneStyle: { backgroundColor: colors.background },
          // ...headerIconContainerStyle,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Invoices",
            headerRight: () => (
              <HeaderActionRow>
                {action("search", "Search invoices", () =>
                  router.push("/invoice/search"),
                )}
              </HeaderActionRow>
            ),
          }}
        />
        <Tabs.Screen
          name="catalogue"
          options={{
            title: "Catalogue",
            headerRight: () => (
              <HeaderActionRow>
                {action("search", "Search catalogue", () =>
                  router.push("/catalogue/search"),
                )}
                {action("folder-open", "Bulk import catalogue", () =>
                  router.push("/catalogue/import"),
                )}
              </HeaderActionRow>
            ),
          }}
        />
        <Tabs.Screen
          name="clients"
          options={{
            title: "Clients",
            headerRight: () => (
              <HeaderActionRow>
                {action("search", "Search clients", () =>
                  router.push("/clients/search"),
                )}
                {action("person-add", "Add from contacts", () =>
                  router.push({
                    pathname: "/clients/new",
                    params: { from: "contacts" },
                  }),
                )}
                {action("folder-open", "Bulk import clients", () =>
                  router.push("/clients/import"),
                )}
              </HeaderActionRow>
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: "Reports",
          }}
        />
        <Tabs.Screen
          name="tools"
          options={{
            title: "Settings",
          }}
        />
      </Tabs>
      <MoreCreateSheet visible={moreOpen} onClose={() => setMoreOpen(false)} />
    </View>
  );
}
