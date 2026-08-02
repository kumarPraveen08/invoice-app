import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Screen, Text, useTheme } from '@/shared/design-system';
import { CURRENCIES } from '@/features/settings/constants';
import { useSettingsStore } from '@/features/settings/store';
import { OverviewGuide } from '../components/OverviewGuide';
import { OVERVIEW_SLIDES, SURVEY_STEPS } from '../steps';

type Phase = 'overview' | 'survey';

export function OnboardingScreen() {
  const { colors, radii, space } = useTheme();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('overview');
  const [overviewIndex, setOverviewIndex] = useState(0);
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [nameError, setNameError] = useState('');

  const business = useSettingsStore((s) => s.business);
  const preferences = useSettingsStore((s) => s.preferences);
  const updateBusiness = useSettingsStore((s) => s.updateBusiness);
  const updatePreferences = useSettingsStore((s) => s.updatePreferences);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase !== 'survey') return;
    fade.setValue(0);
    slide.setValue(18);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.spring(slide, {
        toValue: 0,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, phase, slide, surveyIndex]);

  const finish = () => {
    completeOnboarding();
    router.replace('/auth');
  };

  const goOverviewNext = () => {
    if (overviewIndex < OVERVIEW_SLIDES.length - 1) {
      setOverviewIndex((i) => i + 1);
      return;
    }
    setPhase('survey');
  };

  const surveyStep = SURVEY_STEPS[surveyIndex];

  const goSurveyNext = () => {
    if (surveyStep.id === 'name' && !business.name.trim()) {
      setNameError('Enter your business name to continue.');
      return;
    }
    if (surveyStep.id === 'offering' && !preferences.offering) {
      return;
    }
    setNameError('');
    if (surveyIndex < SURVEY_STEPS.length - 1) {
      setSurveyIndex((i) => i + 1);
      return;
    }
    finish();
  };

  const goSurveyBack = () => {
    setNameError('');
    if (surveyIndex > 0) {
      setSurveyIndex((i) => i - 1);
      return;
    }
    setPhase('overview');
    setOverviewIndex(OVERVIEW_SLIDES.length - 1);
  };

  const progress =
    (OVERVIEW_SLIDES.length + surveyIndex + 1) /
    (OVERVIEW_SLIDES.length + SURVEY_STEPS.length);

  const continueDisabled =
    surveyStep.id === 'offering' && !preferences.offering;

  if (phase === 'overview') {
    return (
      <OverviewGuide
        index={overviewIndex}
        onIndexChange={setOverviewIndex}
        onContinue={goOverviewNext}
        onSkip={() => setPhase('survey')}
      />
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={{
            paddingTop: insets.top + space.md,
            paddingHorizontal: space.lg,
          }}
        >
          <View
            style={[styles.progressTrack, { backgroundColor: colors.surface }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={goSurveyBack}
            hitSlop={8}
            style={{ marginTop: space.md, alignSelf: 'flex-start' }}
          >
            <Text variant="label" style={{ color: colors.primary }}>
              Back
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: space.lg,
            paddingTop: space.xl,
            paddingBottom: space.lg,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              opacity: fade,
              transform: [{ translateY: slide }],
            }}
          >
            <Text
              variant="caption"
              muted
              style={{ marginBottom: space.md, fontSize: 14 }}
            >
              Step {surveyIndex + 1} of {SURVEY_STEPS.length}
            </Text>
            <Text
              style={{
                color: colors.onSurface,
                fontSize: 34,
                lineHeight: 40,
                fontWeight: '800',
                letterSpacing: -0.8,
                marginBottom: space.sm,
              }}
            >
              {surveyStep.title}
            </Text>
            <Text
              style={{
                color: colors.onSurfaceMuted,
                fontSize: 18,
                lineHeight: 26,
                fontWeight: '500',
                marginBottom: space['2xl'],
              }}
            >
              {surveyStep.subtitle}
            </Text>

            {surveyStep.id === 'name' ? (
              <>
                <TextInput
                  value={business.name}
                  onChangeText={(name) => {
                    setNameError('');
                    updateBusiness({ name });
                  }}
                  placeholder="Acme Studio"
                  placeholderTextColor={colors.onSurfaceMuted}
                  autoCapitalize="words"
                  autoFocus
                  style={[
                    styles.input,
                    {
                      color: colors.onSurface,
                      borderBottomColor: nameError
                        ? '#B3261E'
                        : colors.onSurfaceMuted,
                    },
                  ]}
                />
                {nameError ? (
                  <Text
                    variant="caption"
                    style={{ color: '#B3261E', marginTop: 6 }}
                  >
                    {nameError}
                  </Text>
                ) : null}
              </>
            ) : null}

            {surveyStep.id === 'offering' ? (
              <View style={{ gap: space.md }}>
                {(
                  [
                    { id: 'products' as const, label: 'Products' },
                    { id: 'services' as const, label: 'Services' },
                    { id: 'both' as const, label: 'Both' },
                  ] as const
                ).map((option) => {
                  const selected = preferences.offering === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() =>
                        updatePreferences({ offering: option.id })
                      }
                      style={[
                        styles.choice,
                        {
                          borderRadius: radii.lg,
                          borderColor: selected
                            ? colors.primary
                            : colors.surface,
                          backgroundColor: selected
                            ? colors.iconSoft
                            : colors.surface,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: selected ? '700' : '500',
                          color: colors.onSurface,
                        }}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            {surveyStep.id === 'phone' ? (
              <TextInput
                value={business.phone}
                onChangeText={(phone) => updateBusiness({ phone })}
                placeholder="+91 98765 43210"
                placeholderTextColor={colors.onSurfaceMuted}
                keyboardType="phone-pad"
                autoFocus
                style={[
                  styles.input,
                  {
                    color: colors.onSurface,
                    borderBottomColor: colors.onSurfaceMuted,
                  },
                ]}
              />
            ) : null}

            {surveyStep.id === 'email' ? (
              <TextInput
                value={business.email}
                onChangeText={(email) => updateBusiness({ email })}
                placeholder="hello@business.com"
                placeholderTextColor={colors.onSurfaceMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
                style={[
                  styles.input,
                  {
                    color: colors.onSurface,
                    borderBottomColor: colors.onSurfaceMuted,
                  },
                ]}
              />
            ) : null}

            {surveyStep.id === 'address' ? (
              <TextInput
                value={business.address}
                onChangeText={(address) => updateBusiness({ address })}
                placeholder="Street, city, state, ZIP"
                placeholderTextColor={colors.onSurfaceMuted}
                multiline
                autoFocus
                style={[
                  styles.input,
                  {
                    color: colors.onSurface,
                    borderBottomColor: colors.onSurfaceMuted,
                    minHeight: 96,
                    textAlignVertical: 'top',
                    paddingTop: space.sm,
                  },
                ]}
              />
            ) : null}

            {surveyStep.id === 'tax' ? (
              <TextInput
                value={business.taxNumber}
                onChangeText={(taxNumber) => updateBusiness({ taxNumber })}
                placeholder="GST / VAT / EIN"
                placeholderTextColor={colors.onSurfaceMuted}
                autoCapitalize="characters"
                autoFocus
                style={[
                  styles.input,
                  {
                    color: colors.onSurface,
                    borderBottomColor: colors.onSurfaceMuted,
                  },
                ]}
              />
            ) : null}

            {surveyStep.id === 'currency' ? (
              <View style={{ gap: space.xl }}>
                <View>
                  <Text variant="caption" muted style={styles.fieldLabel}>
                    Currency
                  </Text>
                  <View style={[styles.chipWrap, { gap: space.sm }]}>
                    {CURRENCIES.map((item) => {
                      const selected = preferences.currency === item.code;
                      return (
                        <Pressable
                          key={item.code}
                          onPress={() =>
                            updatePreferences({ currency: item.code })
                          }
                          style={[
                            styles.chip,
                            {
                              borderRadius: radii.full,
                              backgroundColor: selected
                                ? colors.primary
                                : colors.surface,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: selected
                                ? colors.onPrimary
                                : colors.onSurface,
                              fontWeight: '600',
                            }}
                          >
                            {item.code}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
                <View>
                  <Text variant="caption" muted style={styles.fieldLabel}>
                    Default tax rate (%)
                  </Text>
                  <TextInput
                    value={preferences.taxRate}
                    onChangeText={(taxRate) =>
                      updatePreferences({ taxRate })
                    }
                    placeholder="18"
                    placeholderTextColor={colors.onSurfaceMuted}
                    keyboardType="decimal-pad"
                    style={[
                      styles.input,
                      {
                        color: colors.onSurface,
                        borderBottomColor: colors.onSurfaceMuted,
                      },
                    ]}
                  />
                </View>
              </View>
            ) : null}
          </Animated.View>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: space.lg,
            paddingBottom: Math.max(insets.bottom, space.lg),
            gap: space.sm,
          }}
        >
          <Pressable
            accessibilityRole="button"
            disabled={continueDisabled}
            onPress={goSurveyNext}
            style={({ pressed }) => [
              styles.cta,
              {
                backgroundColor: colors.primary,
                opacity: continueDisabled ? 0.4 : pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text
              style={{
                color: colors.onPrimary,
                fontWeight: '700',
                textAlign: 'center',
                fontSize: 17,
              }}
            >
              {surveyIndex === SURVEY_STEPS.length - 1 ? 'Finish' : 'Continue'}
            </Text>
          </Pressable>
          {surveyStep.skipLabel ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if (surveyIndex < SURVEY_STEPS.length - 1) {
                  setSurveyIndex((i) => i + 1);
                  return;
                }
                finish();
              }}
              style={({ pressed }) => ({
                paddingVertical: 12,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: '600',
                  textAlign: 'center',
                  fontSize: 16,
                }}
              >
                {surveyStep.skipLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 12,
  },
  choice: {
    borderWidth: 1.5,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  fieldLabel: {
    marginBottom: 8,
  },
  cta: {
    borderRadius: 999,
    minHeight: 56,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
