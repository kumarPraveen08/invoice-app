import { SettingsField } from '../components/SettingsField';
import { SettingsScroll } from '../components/SettingsScroll';
import { useSettingsStore } from '../store';

export function BusinessDetailsScreen() {
  const business = useSettingsStore((s) => s.business);
  const updateBusiness = useSettingsStore((s) => s.updateBusiness);

  return (
    <SettingsScroll>
      <SettingsField
        label="Business name"
        value={business.name}
        onChangeText={(name) => updateBusiness({ name })}
        placeholder="Acme Studio"
        autoCapitalize="words"
      />
      <SettingsField
        label="Phone"
        value={business.phone}
        onChangeText={(phone) => updateBusiness({ phone })}
        placeholder="+91 98765 43210"
        keyboardType="phone-pad"
      />
      <SettingsField
        label="Email"
        value={business.email}
        onChangeText={(email) => updateBusiness({ email })}
        placeholder="hello@business.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <SettingsField
        label="Tax number"
        value={business.taxNumber}
        onChangeText={(taxNumber) => updateBusiness({ taxNumber })}
        placeholder="GST / VAT / EIN"
        autoCapitalize="characters"
      />
      <SettingsField
        label="Website"
        value={business.website}
        onChangeText={(website) => updateBusiness({ website })}
        placeholder="https://"
        autoCapitalize="none"
        keyboardType="url"
      />
      <SettingsField
        label="Address"
        value={business.address}
        onChangeText={(address) => updateBusiness({ address })}
        placeholder="Street, city, state, ZIP"
        multiline
      />
    </SettingsScroll>
  );
}
