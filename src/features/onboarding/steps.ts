import type { IconName } from '@/shared/design-system';

export type OverviewTag = {
  label: string;
  rotate: string;
  x: number;
  y: number;
  dark?: boolean;
};

export type OverviewVisual = 'stack' | 'orbit' | 'chart';

export type OverviewSlide = {
  key: string;
  title: string;
  body: string;
  icon: IconName;
  visual: OverviewVisual;
  background: string;
  glow: string;
  foreground: string;
  button: string;
  buttonText: string;
  accent: string;
  tags: OverviewTag[];
};

export const OVERVIEW_SLIDES: OverviewSlide[] = [
  {
    key: 'invoices',
    title: 'Send invoices fast',
    body: 'Templates, items, done.',
    icon: 'description',
    visual: 'stack',
    background: '#0B2E4A',
    glow: '#1F6FA3',
    foreground: '#FFFFFF',
    button: '#FFFFFF',
    buttonText: '#0B2E4A',
    accent: '#3DB8FF',
    tags: [
      { label: 'INV-1042', rotate: '-12deg', x: -128, y: -96 },
      { label: 'Sent', rotate: '9deg', x: 118, y: -72 },
      { label: 'Paid ✓', rotate: '-4deg', x: 108, y: 108 },
    ],
  },
  {
    key: 'clients',
    title: 'Your people, saved',
    body: 'Clients & items on tap.',
    icon: 'people-outline',
    visual: 'orbit',
    background: '#EFE8FA',
    glow: '#FFFFFF',
    foreground: '#1A1230',
    button: '#1A1230',
    buttonText: '#F7F2FF',
    accent: '#7B5CFF',
    tags: [
      { label: 'Acme Co', rotate: '-9deg', x: -124, y: -10, dark: true },
      { label: '+ Import', rotate: '8deg', x: 116, y: 20, dark: true },
      { label: 'SKU ready', rotate: '5deg', x: 100, y: 150, dark: true },
    ],
  },
  {
    key: 'insights',
    title: 'Cash, clear',
    body: 'See what’s still due.',
    icon: 'analytics',
    visual: 'chart',
    background: '#09080F',
    glow: '#4A3A9A',
    foreground: '#F4F0FF',
    button: '#7B5CFF',
    buttonText: '#FFFFFF',
    accent: '#B8A4FF',
    tags: [
      { label: 'Due ₹48k', rotate: '-7deg', x: -118, y: -6 },
      { label: 'This week', rotate: '10deg', x: 112, y: 18 },
      { label: '↑ 12%', rotate: '-6deg', x: -90, y: 152 },
    ],
  },
];

export type SurveyStepId =
  | 'name'
  | 'offering'
  | 'phone'
  | 'email'
  | 'address'
  | 'tax'
  | 'currency';

export type SurveyStep = {
  id: SurveyStepId;
  title: string;
  subtitle: string;
  required?: boolean;
  skipLabel?: string;
};

export const SURVEY_STEPS: SurveyStep[] = [
  {
    id: 'name',
    title: 'What is your business called?',
    subtitle: 'This appears on every invoice.',
    required: true,
  },
  {
    id: 'offering',
    title: 'What do you mainly sell?',
    subtitle: 'We will tune defaults for your kind of work.',
    required: true,
  },
  {
    id: 'phone',
    title: 'Business phone',
    subtitle: 'Optional — clients can reach you from the invoice.',
    skipLabel: 'Skip',
  },
  {
    id: 'email',
    title: 'Business email',
    subtitle: 'Optional — used on invoices and for sharing.',
    skipLabel: 'Skip',
  },
  {
    id: 'address',
    title: 'Business address',
    subtitle: 'Optional — shown when your template includes it.',
    skipLabel: 'Skip',
  },
  {
    id: 'tax',
    title: 'Tax number',
    subtitle: 'GST, VAT, EIN, or leave blank for now.',
    skipLabel: 'Skip',
  },
  {
    id: 'currency',
    title: 'Currency and tax rate',
    subtitle: 'You can change these later in Settings.',
    required: true,
  },
];
