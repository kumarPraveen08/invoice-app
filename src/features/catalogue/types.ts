export type CatalogueItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  unit: string;
};

export const SAMPLE_CATALOGUE: CatalogueItem[] = [
  {
    id: '1',
    name: 'Brand identity package',
    sku: 'SRV-101',
    category: 'Services',
    price: 45000,
    unit: 'project',
  },
  {
    id: '2',
    name: 'Website landing page',
    sku: 'SRV-102',
    category: 'Services',
    price: 32000,
    unit: 'project',
  },
  {
    id: '3',
    name: 'Monthly retainer',
    sku: 'SRV-201',
    category: 'Services',
    price: 18000,
    unit: 'month',
  },
  {
    id: '4',
    name: 'Business card print',
    sku: 'PRD-11',
    category: 'Products',
    price: 1200,
    unit: 'box',
  },
  {
    id: '5',
    name: 'Letterhead set',
    sku: 'PRD-12',
    category: 'Products',
    price: 850,
    unit: 'pack',
  },
  {
    id: '6',
    name: 'Consultation hour',
    sku: 'SRV-301',
    category: 'Services',
    price: 2500,
    unit: 'hour',
  },
  {
    id: '7',
    name: 'Social media kit',
    sku: 'SRV-103',
    category: 'Services',
    price: 9500,
    unit: 'project',
  },
  {
    id: '8',
    name: 'Sticker sheet',
    sku: 'PRD-21',
    category: 'Products',
    price: 400,
    unit: 'sheet',
  },
  {
    id: '9',
    name: 'Onboarding workshop',
    sku: 'SRV-401',
    category: 'Services',
    price: 22000,
    unit: 'day',
  },
  {
    id: '10',
    name: 'Invoice template pack',
    sku: 'PRD-31',
    category: 'Products',
    price: 1500,
    unit: 'pack',
  },
  {
    id: '11',
    name: 'Photo retouching',
    sku: 'SRV-104',
    category: 'Services',
    price: 800,
    unit: 'image',
  },
  {
    id: '12',
    name: 'Packaging mockup',
    sku: 'SRV-105',
    category: 'Services',
    price: 7500,
    unit: 'project',
  },
];
