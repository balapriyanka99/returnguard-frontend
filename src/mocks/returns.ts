import { ReturnSummaryItem } from '../api/types';

export const mockReturnsList: ReturnSummaryItem[] = [
  {
    return_id: 'RTN-M08-002',
    source_type: 'controlled',
    customer: {
      user_id: 1583,
      display_name: 'Customer 1583'
    },
    order_id: 1951,
    order_item_id: 2805,
    product: {
      product_id: 24205,
      name: 'MacBook Air M2 (13-inch) Space Grey / 256GB',
      category: 'Electronics',
      image_url: null
    },
    reason: 'Item defective / external damage claimed',
    status: 'Under review',
    requested_at: '2025-05-12T10:21:00Z',
    assessment_at: '2025-05-15T09:21:00Z',
    risk: { score: 82, band: 'critical' }, decision: 'MANUAL_REVIEW', reason_for_attention: 'Confirmed serial mismatch during warehouse inspection'
  },
  {
    return_id: 'RTN-S06-001',
    source_type: 'controlled',
    customer: {
      user_id: 2044,
      display_name: 'Customer 2044'
    },
    order_id: 2190,
    order_item_id: 3102,
    product: {
      product_id: 18920,
      name: 'Sony WH-1000XM5 Wireless Headphones',
      category: 'Audio',
      image_url: null
    },
    reason: 'Item missing from package',
    status: 'Awaiting Physical Inspection',
    requested_at: '2025-05-13T14:10:00Z',
    assessment_at: '2025-05-14T16:30:00Z',
    risk: { score: 46, band: 'medium' }, decision: 'REQUIRE_INSPECTION', reason_for_attention: 'Physical inspection is required before a decision'
  },
  {
    return_id: 'RTN-L01-003',
    source_type: 'controlled',
    customer: {
      user_id: 4892,
      display_name: 'Customer 4892'
    },
    order_id: 5410,
    order_item_id: 7921,
    product: {
      product_id: 11044,
      name: 'Nike Air Max Running Shoes (Size 10)',
      category: 'Footwear',
      image_url: null
    },
    reason: 'Size issue / does not fit',
    status: 'Completed · Approved',
    requested_at: '2025-05-15T08:00:00Z',
    assessment_at: '2025-05-15T08:05:00Z',
    risk: { score: 12, band: 'low' }, decision: 'AUTO_APPROVE'
  },
  {
    return_id: 'RTN-LIVE-001',
    source_type: 'source_backed',
    customer: {
      user_id: 3410,
      display_name: 'Customer 3410'
    },
    order_id: 4201,
    order_item_id: 6109,
    product: {
      product_id: 31405,
      name: 'iPhone 14 (128GB) Midnight',
      category: 'Mobile Phones',
      image_url: null
    },
    reason: 'Changed my mind',
    status: 'Pending Assessment',
    requested_at: '2025-05-15T11:00:00Z',
    assessment_at: null,
    risk: null, decision: null
  },
  {
    return_id: 'RTN-COMP-004', source_type: 'controlled', customer: { user_id: 5100, display_name: 'Customer 5100' }, order_id: 6100, order_item_id: 8800,
    product: { product_id: 32000, name: 'Adidas Ultraboost 22', category: 'Footwear', image_url: null }, reason: 'Size issue / does not fit', status: 'Completed · Approved', requested_at: '2025-05-10T08:00:00Z', assessment_at: '2025-05-11T08:10:00Z', risk: { score: 9, band: 'low' }, decision: 'AUTO_APPROVE'
  },
  {
    return_id: 'RTN-REJ-005', source_type: 'controlled', customer: { user_id: 6200, display_name: 'Customer 6200' }, order_id: 7200, order_item_id: 9900,
    product: { product_id: 42000, name: 'Premium Camera Body', category: 'Electronics', image_url: null }, reason: 'Item not as described', status: 'Rejected · Escalated', requested_at: '2025-05-09T12:00:00Z', assessment_at: '2025-05-12T12:20:00Z', risk: { score: 94, band: 'critical' }, decision: 'REJECT_OR_ESCALATE', reason_for_attention: 'Evidence inconsistency requires escalation'
  },
  {
    return_id: 'RTN-PEND-006', source_type: 'controlled', customer: { user_id: 7300, display_name: 'Customer 7300' }, order_id: 8300, order_item_id: 11100,
    product: { product_id: 52000, name: 'Smart Home Security Camera', category: 'Electronics', image_url: null }, reason: 'Stopped working', status: 'Pending Assessment', requested_at: '2025-05-16T09:30:00Z', assessment_at: null, risk: null, decision: null
  }
];
