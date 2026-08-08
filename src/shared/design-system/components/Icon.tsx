import { Host, Icon as ComposeIcon } from '@expo/ui/jetpack-compose';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { Platform } from 'react-native';

import AccountBalanceWallet from '@expo/material-symbols/account_balance_wallet.xml';
import Add from '@expo/material-symbols/add.xml';
import AddCircle from '@expo/material-symbols/add_circle.xml';
import Analytics from '@expo/material-symbols/analytics.xml';
import ArrowBack from '@expo/material-symbols/arrow_back.xml';
import AttachFile from '@expo/material-symbols/attach_file.xml';
import BarChart from '@expo/material-symbols/bar_chart.xml';
import Block from '@expo/material-symbols/block.xml';
import Calculate from '@expo/material-symbols/calculate.xml';
import CalendarToday from '@expo/material-symbols/calendar_today.xml';
import Cancel from '@expo/material-symbols/cancel.xml';
import Check from '@expo/material-symbols/check.xml';
import CheckBox from '@expo/material-symbols/check_box.xml';
import CheckBoxOutlineBlank from '@expo/material-symbols/check_box_outline_blank.xml';
import CheckCircle from '@expo/material-symbols/check_circle.xml';
import ChevronRight from '@expo/material-symbols/chevron_right.xml';
import Close from '@expo/material-symbols/close.xml';
import CreditCard from '@expo/material-symbols/credit_card.xml';
import Delete from '@expo/material-symbols/delete.xml';
import Description from '@expo/material-symbols/description.xml';
import Diamond from '@expo/material-symbols/diamond.xml';
import Download from '@expo/material-symbols/download.xml';
import Drafts from '@expo/material-symbols/drafts.xml';
import Edit from '@expo/material-symbols/edit.xml';
import ErrorIcon from '@expo/material-symbols/error.xml';
import Flag from '@expo/material-symbols/flag.xml';
import FolderOpen from '@expo/material-symbols/folder_open.xml';
import GridView from '@expo/material-symbols/grid_view.xml';
import Group from '@expo/material-symbols/group.xml';
import Groups from '@expo/material-symbols/groups.xml';
import Info from '@expo/material-symbols/info.xml';
import Inventory2 from '@expo/material-symbols/inventory_2.xml';
import KeyboardArrowDown from '@expo/material-symbols/keyboard_arrow_down.xml';
import KeyboardArrowUp from '@expo/material-symbols/keyboard_arrow_up.xml';
import List from '@expo/material-symbols/list.xml';
import Logout from '@expo/material-symbols/logout.xml';
import Mail from '@expo/material-symbols/mail.xml';
import MenuBook from '@expo/material-symbols/menu_book.xml';
import MoreHoriz from '@expo/material-symbols/more_horiz.xml';
import Newspaper from '@expo/material-symbols/newspaper.xml';
import Palette from '@expo/material-symbols/palette.xml';
import Payments from '@expo/material-symbols/payments.xml';
import Person from '@expo/material-symbols/person.xml';
import PersonAdd from '@expo/material-symbols/person_add.xml';
import PieChart from '@expo/material-symbols/pie_chart.xml';
import Receipt from '@expo/material-symbols/receipt.xml';
import ReceiptLong from '@expo/material-symbols/receipt_long.xml';
import Redo from '@expo/material-symbols/redo.xml';
import Repeat from '@expo/material-symbols/repeat.xml';
import Reply from '@expo/material-symbols/reply.xml';
import RocketLaunch from '@expo/material-symbols/rocket_launch.xml';
import Schedule from '@expo/material-symbols/schedule.xml';
import Search from '@expo/material-symbols/search.xml';
import Sell from '@expo/material-symbols/sell.xml';
import Send from '@expo/material-symbols/send.xml';
import Settings from '@expo/material-symbols/settings.xml';
import Share from '@expo/material-symbols/share.xml';
import ShoppingCart from '@expo/material-symbols/shopping_cart.xml';
import Star from '@expo/material-symbols/star.xml';
import Storefront from '@expo/material-symbols/storefront.xml';
import TextFields from '@expo/material-symbols/text_fields.xml';
import Tune from '@expo/material-symbols/tune.xml';
import Undo from '@expo/material-symbols/undo.xml';
import VerifiedUser from '@expo/material-symbols/verified_user.xml';
import Visibility from '@expo/material-symbols/visibility.xml';
import WaterDrop from '@expo/material-symbols/water_drop.xml';

/** App icon keys → Material Symbol XML (Compose) / MaterialIcons fallback names. */
const SOURCES = {
  'account-balance-wallet': AccountBalanceWallet,
  add: Add,
  'add-circle': AddCircle,
  analytics: Analytics,
  'arrow-back': ArrowBack,
  'attach-file': AttachFile,
  'bar-chart': BarChart,
  block: Block,
  business: Storefront,
  calculate: Calculate,
  'calendar-today': CalendarToday,
  cancel: Cancel,
  check: Check,
  'check-box': CheckBox,
  'check-box-outline-blank': CheckBoxOutlineBlank,
  'check-circle-outline': CheckCircle,
  'chevron-right': ChevronRight,
  close: Close,
  'credit-card': CreditCard,
  delete: Delete,
  description: Description,
  diamond: Diamond,
  download: Download,
  drafts: Drafts,
  edit: Edit,
  'error-outline': ErrorIcon,
  'expand-less': KeyboardArrowUp,
  'expand-more': KeyboardArrowDown,
  flag: Flag,
  'folder-open': FolderOpen,
  'grid-view': GridView,
  info: Info,
  'inventory-2': Inventory2,
  list: List,
  'local-offer': Sell,
  logout: Logout,
  mail: Mail,
  'menu-book': MenuBook,
  'more-horiz': MoreHoriz,
  newspaper: Newspaper,
  palette: Palette,
  payments: Payments,
  people: Group,
  'people-outline': Groups,
  person: Person,
  'person-add': PersonAdd,
  'pie-chart': PieChart,
  receipt: Receipt,
  'receipt-long': ReceiptLong,
  redo: Redo,
  repeat: Repeat,
  reply: Reply,
  'rocket-launch': RocketLaunch,
  schedule: Schedule,
  search: Search,
  send: Send,
  settings: Settings,
  share: Share,
  'shopping-cart': ShoppingCart,
  'star-border': Star,
  'text-fields': TextFields,
  tune: Tune,
  undo: Undo,
  'verified-user': VerifiedUser,
  visibility: Visibility,
  'water-drop': WaterDrop,
} as const;

export type IconName = keyof typeof SOURCES;

type Props = {
  name: IconName;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<ViewStyle>;
  /** Screen-reader label (Compose `contentDescription`). */
  accessibilityLabel?: string;
};

/** App-wide icon — Jetpack Compose Material Symbols on Android. */
export function Icon({ name, size = 24, color, style, accessibilityLabel }: Props) {
  if (Platform.OS !== 'android') {
    return (
      <MaterialIcons
        name={name as ComponentProps<typeof MaterialIcons>['name']}
        size={size}
        color={color}
        style={style}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return (
    <Host matchContents style={style}>
      <ComposeIcon
        source={SOURCES[name]}
        size={size}
        tint={color}
        contentDescription={accessibilityLabel}
      />
    </Host>
  );
}
