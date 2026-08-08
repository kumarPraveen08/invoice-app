export type Client = {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address?: string;
  profileImageUri?: string | null;
};

export const SAMPLE_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Aisha Khan',
    businessName: 'Northwind Studio',
    email: 'aisha@northwind.co',
    phone: '+91 98765 41001',
    address: '12 MG Road, Bengaluru',
  },
  {
    id: '2',
    name: 'Ben Carter',
    businessName: 'Brightline Co.',
    email: 'ben@brightline.io',
    phone: '+91 98765 41002',
    address: '88 Quay Street, Mumbai',
  },
  {
    id: '3',
    name: 'Chloe Mendes',
    businessName: 'Cedar & Oak',
    email: 'chloe@cedaroak.in',
    phone: '+91 98765 41003',
    address: '4 Lake View, Pune',
  },
  {
    id: '4',
    name: 'Dev Patel',
    businessName: 'Kala Print House',
    email: 'dev@kalaprint.com',
    phone: '+91 98765 41004',
  },
  {
    id: '5',
    name: 'Elena Rossi',
    businessName: 'Orbit Labs',
    email: 'elena@orbitlabs.dev',
    phone: '+91 98765 41005',
    address: 'Tech Park B, Hyderabad',
  },
  {
    id: '6',
    name: 'Farhan Ali',
    businessName: 'Harbor Dental',
    email: 'farhan@harbordental.in',
    phone: '+91 98765 41006',
    address: '19 Marine Drive, Kochi',
  },
  {
    id: '7',
    name: 'Grace Liu',
    businessName: 'Pixel Forge',
    email: 'grace@pixelforge.co',
    phone: '+91 98765 41007',
  },
  {
    id: '8',
    name: 'Hassan Mir',
    businessName: 'Sunrise Bakery',
    email: 'hassan@sunrise.bake',
    phone: '+91 98765 41008',
    address: '3 Baker Lane, Delhi',
  },
  {
    id: '9',
    name: 'Ivy Chen',
    businessName: 'Astra Logistics',
    email: 'ivy@astralog.com',
    phone: '+91 98765 41009',
  },
  {
    id: '10',
    name: 'Jay Mehta',
    businessName: 'Greenfield Clinic',
    email: 'jay@greenfield.care',
    phone: '+91 98765 41010',
    address: 'Clinic Road, Ahmedabad',
  },
  {
    id: '11',
    name: 'Kira Bose',
    businessName: 'Nova Retail',
    email: 'kira@novaretail.in',
    phone: '+91 98765 41011',
  },
  {
    id: '12',
    name: 'Leo Fernandes',
    businessName: 'Summit Advisors',
    email: 'leo@summitadv.com',
    phone: '+91 98765 41012',
    address: '22 Ridge Avenue, Goa',
  },
  {
    id: '13',
    name: 'Maya Suri',
    businessName: 'Loom & Thread',
    email: 'maya@loomthread.in',
    phone: '+91 98765 41013',
  },
  {
    id: '14',
    name: 'Nikhil Rao',
    businessName: 'Bluecart Supply',
    email: 'nikhil@bluecart.co',
    phone: '+91 98765 41014',
    address: 'Warehouse 7, Chennai',
  },
  {
    id: '15',
    name: 'Omar Siddiqui',
    businessName: 'City Lights Media',
    email: 'omar@citylights.tv',
    phone: '+91 98765 41015',
  },
];
