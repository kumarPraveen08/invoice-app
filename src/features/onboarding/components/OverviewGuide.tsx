import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Icon, Text} from '@/shared/design-system';
import { OVERVIEW_SLIDES, type OverviewSlide } from '../steps';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const STAGE = Math.min(SCREEN_W * 0.78, 320);

type Props = {
  index: number;
  onIndexChange: (index: number) => void;
  onContinue: () => void;
  onSkip: () => void;
};

function FloatingTag({
  label,
  rotate,
  x,
  y,
  delay,
  active,
  dark,
}: {
  label: string;
  rotate: string;
  x: number;
  y: number;
  delay: number;
  active: boolean;
  dark?: boolean;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      anim.setValue(0);
      return;
    }
    anim.setValue(0);
    Animated.spring(anim, {
      toValue: 1,
      delay,
      friction: 7,
      tension: 70,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 2000 + delay,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 2000 + delay,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, anim, delay, float]);

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [y, y - 8],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.tag,
        {
          backgroundColor: dark ? '#1A1230' : '#FFFFFF',
          zIndex: 20,
          elevation: 12,
          transform: [
            { translateX: x },
            { translateY },
            { rotate },
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.55, 1],
              }),
            },
          ],
          opacity: anim,
        },
      ]}
    >
      <Text
        variant="caption"
        style={{
          color: dark ? '#F7F2FF' : '#1A1525',
          fontWeight: '700',
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

/** Fan of invoice sheets */
function VisualStack({ item, active }: { item: OverviewSlide; active: boolean }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) {
      a.setValue(0);
      return;
    }
    Animated.spring(a, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [a, active]);

  const sheet = (offsetX: number, rotate: string, z: number, delay: number) => {
    const t = a.interpolate({
      inputRange: [0, 1],
      outputRange: [40 + delay * 10, 0],
    });
    return (
      <Animated.View
        style={[
          styles.invoiceSheet,
          {
            zIndex: z,
            backgroundColor: z === 3 ? '#FFFFFF' : z === 2 ? '#E8F4FC' : '#D0E8F7',
            transform: [
              {
                translateY: t,
              },
              { translateX: offsetX },
              { rotate },
              {
                scale: a.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.86, 1],
                }),
              },
            ],
            opacity: a,
          },
        ]}
      >
        <View style={[styles.sheetAccent, { backgroundColor: item.accent }]} />
        <View style={styles.sheetLineWide} />
        <View style={styles.sheetLine} />
        <View style={[styles.sheetLine, { width: '45%' }]} />
        {z === 3 ? (
          <Text style={styles.sheetAmount}>₹24,190</Text>
        ) : null}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.stage, { zIndex: 1 }]}>
      {sheet(-28, '-14deg', 1, 2)}
      {sheet(8, '6deg', 2, 1)}
      {sheet(36, '16deg', 3, 0)}
    </View>
  );
}

/** Avatar orbit */
function VisualOrbit({ item, active }: { item: OverviewSlide; active: boolean }) {
  const spin = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      pop.setValue(0);
      return;
    }
    Animated.spring(pop, {
      toValue: 1,
      friction: 6,
      tension: 55,
      useNativeDriver: true,
    }).start();
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 14000,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
      spin.setValue(0);
    };
  }, [active, pop, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const people = [
    { initials: 'AC', color: '#7B5CFF', x: -70, y: -50 },
    { initials: 'JD', color: '#E85D75', x: 70, y: -40 },
    { initials: 'SK', color: '#2BB673', x: -55, y: 70 },
    { initials: 'RM', color: '#E8A838', x: 65, y: 65 },
  ];

  return (
    <View style={styles.stage}>
      <Animated.View
        style={[
          styles.orbitRing,
          {
            borderColor: item.accent,
            transform: [{ rotate }, { scale: pop }],
            opacity: pop,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orbitCore,
          {
            backgroundColor: item.accent,
            transform: [{ scale: pop }],
            opacity: pop,
          },
        ]}
      >
        <Icon name="people" size={36} color="#FFFFFF" />
      </Animated.View>
      {people.map((p, i) => (
        <Animated.View
          key={p.initials}
          style={[
            styles.avatar,
            {
              backgroundColor: p.color,
              left: STAGE / 2 + p.x - 28,
              top: STAGE / 2 + p.y - 28,
              transform: [
                {
                  scale: pop.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1],
                  }),
                },
              ],
              opacity: pop,
            },
          ]}
        >
          <Text style={styles.avatarText}>{p.initials}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

/** Rising bars + big due figure */
function VisualChart({ item, active }: { item: OverviewSlide; active: boolean }) {
  const bars = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      bars.forEach((b) => b.setValue(0));
      pop.setValue(0);
      return;
    }
    Animated.spring(pop, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
    Animated.stagger(
      70,
      bars.map((b) =>
        Animated.spring(b, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [active, bars, pop]);

  const heights = [0.35, 0.55, 0.42, 0.78, 0.62];

  return (
    <View style={styles.stage}>
      <Animated.View
        style={[
          styles.chartCard,
          {
            transform: [{ scale: pop }],
            opacity: pop,
          },
        ]}
      >
        <Text style={[styles.chartLabel, { color: item.accent }]}>OUTSTANDING</Text>
        <Text
          style={[styles.chartValue, { color: item.foreground }]}
          numberOfLines={1}
        >
          ₹48,200
        </Text>
        <View style={styles.barRow}>
          {bars.map((b, i) => {
            const h = 110 * heights[i];
            return (
              <View key={i} style={{ flex: 1, height: 110, justifyContent: 'flex-end' }}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: h,
                      backgroundColor: i === 3 ? item.accent : `${item.accent}55`,
                      opacity: b,
                      transform: [
                        {
                          translateY: b.interpolate({
                            inputRange: [0, 1],
                            outputRange: [24, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

function SlideVisual({ item, active }: { item: OverviewSlide; active: boolean }) {
  if (item.visual === 'orbit') return <VisualOrbit item={item} active={active} />;
  if (item.visual === 'chart') return <VisualChart item={item} active={active} />;
  return <VisualStack item={item} active={active} />;
}

function SlidePage({
  item,
  index,
  active,
  pageCount,
  onContinue,
  onSkip,
  topPad,
  bottomPad,
}: {
  item: OverviewSlide;
  index: number;
  active: boolean;
  pageCount: number;
  onContinue: () => void;
  onSkip: () => void;
  topPad: number;
  bottomPad: number;
}) {
  const copyY = useRef(new Animated.Value(22)).current;
  const copyOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      copyY.setValue(22);
      copyOpacity.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(copyOpacity, {
        toValue: 1,
        duration: 360,
        delay: 80,
        useNativeDriver: true,
      }),
      Animated.spring(copyY, {
        toValue: 0,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [active, copyOpacity, copyY]);

  return (
    <View
      style={[
        styles.page,
        {
          width: SCREEN_W,
          height: SCREEN_H,
          backgroundColor: item.background,
          paddingTop: topPad,
          paddingBottom: bottomPad,
        },
      ]}
    >
      <View pointerEvents="none" style={[styles.glowTop, { backgroundColor: item.glow }]} />
      <View pointerEvents="none" style={[styles.glowBottom, { backgroundColor: item.glow }]} />

      <View style={styles.skipRow}>
        <Pressable accessibilityRole="button" onPress={onSkip} hitSlop={12}>
          <Text
            style={{
              color: item.foreground,
              opacity: 0.6,
              fontWeight: '600',
              fontSize: 15,
            }}
          >
            Skip
          </Text>
        </Pressable>
      </View>

      <View style={styles.main}>
        <View style={styles.visualWrap}>
          <SlideVisual item={item} active={active} />
          {item.tags.map((tag, i) => (
            <FloatingTag
              key={tag.label}
              label={tag.label}
              rotate={tag.rotate}
              x={tag.x}
              y={tag.y}
              delay={140 + i * 110}
              active={active}
              dark={tag.dark}
            />
          ))}
        </View>

        <Animated.View
          style={{
            opacity: copyOpacity,
            transform: [{ translateY: copyY }],
            paddingHorizontal: 28,
          }}
        >
          <Text
            style={{
              color: item.foreground,
              textAlign: 'center',
              fontSize: 36,
              lineHeight: 42,
              fontWeight: '800',
              letterSpacing: -0.8,
              marginBottom: 10,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              color: item.foreground,
              opacity: 0.7,
              textAlign: 'center',
              fontSize: 18,
              lineHeight: 26,
              fontWeight: '500',
            }}
          >
            {item.body}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {Array.from({ length: pageCount }).map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 3,
                backgroundColor: item.foreground,
                opacity: i === index ? 1 : 0.3,
              }}
            />
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onContinue}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: item.button,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text
            style={{
              color: item.buttonText,
              fontWeight: '700',
              textAlign: 'center',
              fontSize: 17,
            }}
          >
            {index === pageCount - 1 ? 'Get started' : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function OverviewGuide({
  index,
  onIndexChange,
  onContinue,
  onSkip,
}: Props) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<OverviewSlide>>(null);
  const ignoreScrollSync = useRef(false);
  const topPad = Math.max(insets.top, 12) + 8;
  const bottomPad = Math.max(insets.bottom, 16) + 8;

  useEffect(() => {
    // Swipe already moved the list — don't scrollToIndex again (causes bounce/oscillation).
    if (ignoreScrollSync.current) {
      ignoreScrollSync.current = false;
      return;
    }
    listRef.current?.scrollToIndex({ index, animated: true });
  }, [index]);

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / SCREEN_W);
    if (next !== index && next >= 0 && next < OVERVIEW_SLIDES.length) {
      ignoreScrollSync.current = true;
      onIndexChange(next);
    }
  };

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        data={OVERVIEW_SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        getItemLayout={(_, i) => ({
          length: SCREEN_W,
          offset: SCREEN_W * i,
          index: i,
        })}
        renderItem={({ item, index: i }) => (
          <SlidePage
            item={item}
            index={i}
            active={i === index}
            pageCount={OVERVIEW_SLIDES.length}
            onContinue={onContinue}
            onSkip={onSkip}
            topPad={topPad}
            bottomPad={bottomPad}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B2E4A' },
  page: { overflow: 'hidden' },
  glowTop: {
    position: 'absolute',
    top: -SCREEN_W * 0.35,
    right: -SCREEN_W * 0.35,
    width: SCREEN_W * 0.7,
    height: SCREEN_W * 0.7,
    borderRadius: SCREEN_W,
    opacity: 0.28,
    zIndex: 0,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -SCREEN_W * 0.4,
    left: -SCREEN_W * 0.35,
    width: SCREEN_W * 0.65,
    height: SCREEN_W * 0.65,
    borderRadius: SCREEN_W,
    opacity: 0.18,
    zIndex: 0,
  },
  skipRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 22,
    zIndex: 2,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  visualWrap: {
    width: STAGE + 80,
    height: STAGE + 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'visible',
  },
  stage: {
    width: STAGE,
    height: STAGE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  invoiceSheet: {
    position: 'absolute',
    width: STAGE * 0.58,
    height: STAGE * 0.72,
    borderRadius: 16,
    padding: 16,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  sheetAccent: {
    height: 5,
    width: '40%',
    borderRadius: 3,
    marginBottom: 14,
  },
  sheetLineWide: {
    height: 8,
    width: '70%',
    borderRadius: 4,
    backgroundColor: '#D8DEE6',
    marginBottom: 8,
  },
  sheetLine: {
    height: 7,
    width: '55%',
    borderRadius: 3.5,
    backgroundColor: '#E4E9EF',
    marginBottom: 7,
  },
  sheetAmount: {
    marginTop: 'auto',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: '#0B2E4A',
    letterSpacing: -0.5,
    paddingBottom: 2,
  },
  orbitRing: {
    position: 'absolute',
    width: STAGE * 0.72,
    height: STAGE * 0.72,
    borderRadius: STAGE,
    borderWidth: 2,
    borderStyle: 'dashed',
    opacity: 0.45,
  },
  orbitCore: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  avatar: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  chartCard: {
    width: STAGE * 0.82,
    borderRadius: 24,
    padding: 20,
    paddingBottom: 22,
    backgroundColor: '#16141F',
    borderWidth: 1,
    borderColor: '#2A2640',
    overflow: 'visible',
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  chartValue: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 16,
    paddingBottom: 4,
    includeFontPadding: false,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    gap: 10,
  },
  bar: {
    flex: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tag: {
    position: 'absolute',
    left: '50%',
    top: '42%',
    marginLeft: -50,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
    zIndex: 20,
  },
  footer: {
    paddingHorizontal: 22,
    gap: 18,
    zIndex: 2,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    borderRadius: 999,
    minHeight: 56,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
