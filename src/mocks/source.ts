import {
  SourceCustomer,
  SourceOrder,
  SourceOrderItem
} from '../api/types';

export const mockSourceCustomers: SourceCustomer[] = [
  { user_id: 1583, display_name: 'Customer 1583' },
  { user_id: 2044, display_name: 'Customer 2044' },
  { user_id: 3410, display_name: 'Customer 3410' },
  { user_id: 4892, display_name: 'Customer 4892' },
  { user_id: 5120, display_name: 'Customer 5120' }
];

export const mockSourceOrders: Record<number, SourceOrder[]> = {
  1583: [
    { order_id: 1951, created_at: '2025-05-05T14:30:00Z', status: 'Delivered', num_of_item: 2 },
    { order_id: 1820, created_at: '2025-04-12T09:15:00Z', status: 'Delivered', num_of_item: 1 }
  ],
  2044: [
    { order_id: 2190, created_at: '2025-05-08T18:20:00Z', status: 'Delivered', num_of_item: 1 }
  ],
  3410: [
    { order_id: 4201, created_at: '2025-05-10T11:05:00Z', status: 'Delivered', num_of_item: 3 }
  ],
  4892: [
    { order_id: 5410, created_at: '2025-05-11T16:00:00Z', status: 'Delivered', num_of_item: 1 }
  ],
  5120: [
    { order_id: 6812, created_at: '2025-05-09T08:45:00Z', status: 'Delivered', num_of_item: 2 }
  ]
};

export const mockSourceOrderItems: Record<number, SourceOrderItem[]> = {
  1951: [
    {
      order_item_id: 2805,
      product_id: 24205,
      product_name: 'MacBook Air M2 (13-inch) Space Grey / 256GB',
      category: 'Electronics',
      sale_price: 598.0,
      image_url: null
    },
    {
      order_item_id: 2806,
      product_id: 15402,
      product_name: 'Apple USB-C Power Adapter 67W',
      category: 'Accessories',
      sale_price: 59.0,
      image_url: null
    }
  ],
  4201: [
    {
      order_item_id: 6109,
      product_id: 31405,
      product_name: 'iPhone 14 (128GB) Midnight',
      category: 'Mobile Phones',
      sale_price: 799.0,
      image_url: null
    }
  ],
  5410: [
    {
      order_item_id: 7921,
      product_id: 11044,
      product_name: 'Nike Air Max Running Shoes (Size 10)',
      category: 'Footwear',
      sale_price: 139.0,
      image_url: null
    }
  ],
  6812: [
    {
      order_item_id: 9918,
      product_id: 28410,
      product_name: 'Samsung 4K Gaming Monitor 27"',
      category: 'Electronics',
      sale_price: 349.0,
      image_url: null
    }
  ]
};
