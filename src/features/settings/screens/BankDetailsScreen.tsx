import { SettingsField } from '../components/SettingsField';
import { SettingsScroll } from '../components/SettingsScroll';
import { useSettingsStore } from '../store';

export function BankDetailsScreen() {
  const bank = useSettingsStore((s) => s.bank);
  const updateBank = useSettingsStore((s) => s.updateBank);

  return (
    <SettingsScroll>
      <SettingsField
        label="Account name"
        value={bank.accountName}
        onChangeText={(accountName) => updateBank({ accountName })}
        placeholder="Account holder name"
        autoCapitalize="words"
      />
      <SettingsField
        label="Account number"
        value={bank.accountNumber}
        onChangeText={(accountNumber) => updateBank({ accountNumber })}
        placeholder="0000000000"
        keyboardType="number-pad"
      />
      <SettingsField
        label="Bank name"
        value={bank.bankName}
        onChangeText={(bankName) => updateBank({ bankName })}
        placeholder="Bank name"
        autoCapitalize="words"
      />
      <SettingsField
        label="IFSC / SWIFT / routing"
        value={bank.routingCode}
        onChangeText={(routingCode) => updateBank({ routingCode })}
        placeholder="Routing code"
        autoCapitalize="characters"
      />
      <SettingsField
        label="Payment instructions"
        value={bank.paymentInstructions}
        onChangeText={(paymentInstructions) =>
          updateBank({ paymentInstructions })
        }
        placeholder="UPI, PayPal, or other payment notes"
        multiline
      />
    </SettingsScroll>
  );
}
