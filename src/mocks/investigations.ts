import { ReturnDetailResponse, AssessmentHistoryResponse, TimelineEvent } from '../api/types';

export const mockInvestigationM08: ReturnDetailResponse = {
  return_id: 'RTN-M08-002',
  source_type: 'controlled',
  return: {
    order_id: 1951,
    order_item_id: 2805,
    user_id: 1583,
    product_id: 24205,
    reason: 'Item defective / external damage claimed',
    status: 'Under review',
    requested_at: '2025-05-12T10:21:00Z',
    assessment_at: '2025-05-15T09:21:00Z',
    sale_price: 598.0,
    product_name: 'MacBook Air M2 (13-inch) Space Grey / 256GB',
    product_category: 'Electronics / Laptops',
    customer_name: 'Customer 1583'
  },
  customer: {
    status: 'completed',
    data_state: 'live_source',
    summary: 'Historical source activity is available for comparison. These metrics are context, not a fraud conclusion.',
    metrics: {
      tenure_months: 16,
      order_count: 34,
      total_spend: 2450.0,
      return_count: 5,
      return_rate: 0.147,
      recent_return_count: 2,
      lifetime_value: 2450.0,
      frequent_returner: true
    },
    findings: [
      'Return rate in available history is 14.7%',
      'Two electronics returns are recorded in the last 60 days'
    ],
    limitations: [
      'Available history is limited to the frozen source snapshot'
    ]
  },
  product: {
    status: 'completed',
    data_state: 'live_source',
    summary: 'Product return history is available for comparison with its category.',
    metrics: {
      sku: 'MBA-M2-13-256G',
      historical_return_rate: 0.128,
      sample_count: 1420,
      category_return_rate: 0.042,
      merchant_fault_rate: 0.42,
      top_reasons: [
        { reason: 'Item defective / Not working', percentage: 42 },
        { reason: 'Wrong item shipped', percentage: 20 },
        { reason: 'Changed my mind', percentage: 18 },
        { reason: 'Found better price', percentage: 10 },
        { reason: 'Other', percentage: 10 }
      ]
    },
    findings: [
      'Product return rate is 12.8% in the available sample',
      'Defective or not-working is the most frequent recorded reason'
    ],
    limitations: [
      'Product packaging was updated in recent manufacturer batch'
    ]
  },
  inspection: {
    available: true,
    item_present: true,
    condition: 'salable',
    expected_weight_kg: 1.2,
    actual_weight_kg: 1.246,
    weight_delta_kg: 0.046,
    weight_ratio: 1.0383,
    serial_comparison_performed: true,
    serial_mismatch: true,
    accessory_comparison_performed: true,
    missing_accessories: [],
    inspected_at: '2025-05-15T09:16:00Z'
  },
  evidence: {
    available: true,
    items: [
      {
        evidence_id: 'EVD-001',
        evidence_type: 'image',
        stage: 'CUSTOMER_UPLOAD',
        observed_at: '2025-05-12T10:35:00Z',
        display_url: null,
        title: 'Customer Claim Photo',
        notes: 'Damage visible on outer box; inner device appears intact'
      },
      {
        evidence_id: 'EVD-002',
        evidence_type: 'image',
        stage: 'WAREHOUSE',
        observed_at: '2025-05-15T09:14:00Z',
        display_url: null,
        title: 'Warehouse Intake Scan',
        notes: 'Serial label scanned on outer retail box'
      }
    ]
  },
  network: {
    available: true,
    contextual_evidence_only: true,
    relationship_count: 1,
    relationships: [
      {
        target_id: 'USR-8921',
        relationship_type: 'Shared Device Fingerprint',
        strength: 'Medium',
        details: 'Shared device fingerprint detected across 2 merchant accounts with active returns'
      }
    ],
    cluster_notes: 'One relationship is available for contextual review only.'
  },
  economics: {
    item_value: 598.0,
    product_cost: 480.0,
    reverse_logistics_cost: 84.35,
    inspection_cost: 24.0,
    recovery_value: 174.14,
    net_return_cost: 0.0,
    calculation_at: '2025-05-15T09:20:00Z'
  },
  risk: { score: 82, band: 'critical', reason_codes: ['serial_mismatch'], signal_contributions: [{ name: 'Serial mismatch', severity: 'high', supporting_fact: 'Returned serial does not match the outbound order record.', source: 'Warehouse Inspection', contribution_pct: 42 }], limitations: [] },
  decision: { recommended_action: 'MANUAL_REVIEW', confidence: 'high', policy_name: 'Controlled demo decision fixture', limitations: [], status: 'completed' },
  vision: null, // Visual assessment has not been performed
  limitations: [
    'Carrier transit weigh-in data was not recorded at dropoff',
    'Vision defect model inference pending batch queue'
  ],
  evidence_coverage: 'sufficient'
};

export const mockInvestigationLive: ReturnDetailResponse = {
  return_id: 'RTN-LIVE-001',
  source_type: 'source_backed',
  return: {
    order_id: 4201,
    order_item_id: 6109,
    user_id: 3410,
    product_id: 31405,
    reason: 'Changed my mind',
    status: 'Pending Assessment',
    requested_at: '2025-05-15T11:00:00Z',
    assessment_at: null,
    sale_price: 799.0,
    product_name: 'iPhone 14 (128GB) Midnight',
    product_category: 'Mobile Phones',
    customer_name: 'Customer 3410'
  },
  customer: {
    status: 'completed',
    data_state: 'live_source',
    summary: 'Standard customer profile with 3 lifetime purchases and zero previous returns.',
    metrics: {
      tenure_months: 6,
      order_count: 3,
      total_spend: 1120.0,
      return_count: 0,
      return_rate: 0.0,
      recent_return_count: 0,
      lifetime_value: 1120.0,
      frequent_returner: false
    },
    findings: [
      'First return request from this customer',
      'Normal purchasing cadence'
    ],
    limitations: []
  },
  product: {
    status: 'completed',
    data_state: 'live_source',
    summary: 'iPhone 14 standard return rate is 3.1%.',
    metrics: {
      sku: 'IPH-14-128-MDN',
      historical_return_rate: 0.031,
      sample_count: 3820,
      category_return_rate: 0.035
    },
    findings: [
      'Product return rate is within normal baseline'
    ],
    limitations: []
  },
  inspection: null, // Warehouse inspection is not available yet
  evidence: null,
  network: null,
  economics: {
    item_value: 799.0,
    reverse_logistics_cost: 15.0,
    inspection_cost: 8.0,
    recovery_value: 740.0,
    net_return_cost: 23.0
  },
  risk: null, // Preserved explicitly as null
  decision: null, // "Decision assessment pending"
  vision: null,
  limitations: [
    'Newly raised return: Physical parcel not yet received at warehouse facility',
    'No warehouse inspection or physical evidence available at this stage'
  ]
};

const mockMissingItem: ReturnDetailResponse = {
  return_id: 'RTN-S06-001', source_type: 'controlled',
  return: { order_id: 2190, order_item_id: 3102, user_id: 2044, product_id: 18920, reason: 'Item missing from package', status: 'Awaiting Physical Inspection', requested_at: '2025-05-13T14:10:00Z', assessment_at: '2025-05-14T16:30:00Z', sale_price: 349, product_name: 'Sony WH-1000XM5 Wireless Headphones', product_category: 'Audio', customer_name: 'Customer 2044' },
  customer: { status: 'completed', data_state: 'insufficient_history', summary: 'Insufficient customer history', metrics: { order_count: 1, return_count: 0 }, findings: [], limitations: ['Insufficient historical activity for a reliable behavioral comparison'] },
  product: null,
  inspection: null,
  evidence: null,
  network: { available: false, contextual_evidence_only: true, relationship_count: 0, relationships: [] },
  economics: { item_value: 349, reverse_logistics_cost: 18, inspection_cost: 12, recovery_value: 0, net_return_cost: 379 },
  risk: { score: 46, band: 'medium', reason_codes: [], signal_contributions: [], limitations: ['Physical condition is not yet verified'] }, decision: { recommended_action: 'REQUIRE_INSPECTION', confidence: 'medium', limitations: ['Final decision awaits warehouse inspection'], status: 'completed' }, vision: null,
  limitations: ['Visual assessment has not been performed', 'No customer-uploaded evidence is available'], evidence_coverage: 'partial'
};

const mockNormalCase: ReturnDetailResponse = {
  return_id: 'RTN-L01-003', source_type: 'controlled',
  return: { order_id: 5410, order_item_id: 7921, user_id: 4892, product_id: 11044, reason: 'Size issue / does not fit', status: 'Completed · Approved', requested_at: '2025-05-15T08:00:00Z', assessment_at: '2025-05-15T08:05:00Z', sale_price: 139, product_name: 'Nike Air Max Running Shoes (Size 10)', product_category: 'Footwear', customer_name: 'Customer 4892' },
  customer: { status: 'completed', data_state: 'live_source', summary: 'Historical activity is available and provides routine context.', metrics: { tenure_months: 22, order_count: 12, total_spend: 880, return_count: 1, return_rate: 0.083 }, findings: ['One prior return is present in the available source history'], limitations: ['History is limited to the frozen source snapshot'] },
  product: { status: 'completed', data_state: 'live_source', summary: 'Product history is available for contextual comparison.', metrics: { historical_return_rate: 0.09, sample_count: 320, category_return_rate: 0.1 }, findings: ['Size and fit is a recurring return reason for this product category'], limitations: [] },
  inspection: { available: true, item_present: true, condition: 'salable', expected_weight_kg: 0.72, actual_weight_kg: 0.73, weight_delta_kg: 0.01, weight_ratio: 1.014, serial_comparison_performed: false, serial_mismatch: null, accessory_comparison_performed: true, missing_accessories: [], inspected_at: '2025-05-15T08:04:00Z' },
  evidence: null,
  network: { available: false, contextual_evidence_only: true, relationship_count: 0, relationships: [] },
  economics: { item_value: 139, reverse_logistics_cost: 12, inspection_cost: 7, recovery_value: 105, net_return_cost: 53 },
  risk: { score: 12, band: 'low', reason_codes: [], signal_contributions: [], limitations: [] }, decision: { recommended_action: 'AUTO_APPROVE', confidence: 'high', limitations: [], status: 'completed' }, vision: null,
  limitations: ['Visual assessment has not been performed'], evidence_coverage: 'sufficient'
};

const mockApprovedCase: ReturnDetailResponse = {
  return_id: 'RTN-COMP-004', source_type: 'controlled',
  return: { order_id: 6100, order_item_id: 8800, user_id: 5100, product_id: 32000, reason: 'Size issue / does not fit', status: 'Completed · Approved', requested_at: '2025-05-10T08:00:00Z', assessment_at: '2025-05-11T08:10:00Z', sale_price: 119, product_name: 'Adidas Ultraboost 22', product_category: 'Footwear', customer_name: 'Customer 5100' },
  customer: null, product: null,
  inspection: { available: true, item_present: true, condition: 'salable', expected_weight_kg: 0.8, actual_weight_kg: 0.8, weight_delta_kg: 0, weight_ratio: 1, serial_comparison_performed: false, serial_mismatch: null, accessory_comparison_performed: true, missing_accessories: [], inspected_at: '2025-05-11T08:00:00Z' },
  evidence: null, network: null, economics: { item_value: 119, reverse_logistics_cost: 10, inspection_cost: 6, recovery_value: 100, net_return_cost: 35 },
  risk: { score: 9, band: 'low', reason_codes: [], signal_contributions: [], limitations: [] }, decision: { recommended_action: 'AUTO_APPROVE', confidence: 'high', limitations: [], status: 'completed' }, vision: null, limitations: [], evidence_coverage: 'sufficient'
};

const mockRejectedCase: ReturnDetailResponse = {
  return_id: 'RTN-REJ-005', source_type: 'controlled',
  return: { order_id: 7200, order_item_id: 9900, user_id: 6200, product_id: 42000, reason: 'Item not as described', status: 'Rejected · Escalated', requested_at: '2025-05-09T12:00:00Z', assessment_at: '2025-05-12T12:20:00Z', sale_price: 899, product_name: 'Premium Camera Body', product_category: 'Electronics', customer_name: 'Customer 6200' },
  customer: null, product: null, inspection: null, evidence: null, network: null, economics: { item_value: 899, reverse_logistics_cost: 38, inspection_cost: 18, recovery_value: 0, net_return_cost: 955 },
  risk: { score: 94, band: 'critical', reason_codes: ['evidence_inconsistency'], signal_contributions: [{ name: 'Evidence inconsistency', severity: 'high', supporting_fact: 'Submitted evidence conflicts with the recorded item condition.', source: 'Controlled Scenario', contribution_pct: 61 }], limitations: [] }, decision: { recommended_action: 'REJECT_OR_ESCALATE', confidence: 'high', limitations: [], status: 'completed' }, vision: null, limitations: [], evidence_coverage: 'sufficient'
};

const mockPendingCase: ReturnDetailResponse = {
  return_id: 'RTN-PEND-006', source_type: 'controlled',
  return: { order_id: 8300, order_item_id: 11100, user_id: 7300, product_id: 52000, reason: 'Stopped working', status: 'Pending Assessment', requested_at: '2025-05-16T09:30:00Z', assessment_at: null, sale_price: 149, product_name: 'Smart Home Security Camera', product_category: 'Electronics', customer_name: 'Customer 7300' },
  customer: null, product: null, inspection: null, evidence: null, network: null,
  economics: { item_value: 149, reverse_logistics_cost: 0, inspection_cost: 0, recovery_value: 0, net_return_cost: 0 },
  risk: null, decision: null, vision: null, limitations: ['Assessment has not started', 'No physical inspection is available'], evidence_coverage: 'pending'
};

export const mockInvestigationMap: Record<string, ReturnDetailResponse> = {
  'RTN-M08-002': mockInvestigationM08,
  'RTN-S06-001': mockMissingItem,
  'RTN-L01-003': mockNormalCase,
  'RTN-LIVE-001': mockInvestigationLive,
  'RTN-COMP-004': mockApprovedCase,
  'RTN-REJ-005': mockRejectedCase,
  'RTN-PEND-006': mockPendingCase
};

export const mockAssessmentHistoryMap: Record<string, AssessmentHistoryResponse> = {
  'RTN-M08-002': {
    items: [
      {
        assessment_id: 'ASM-M08-01',
        assessment_at: '2025-05-12T10:21:00Z',
        stage: 'requested',
        stage_label: 'Requested',
        risk: null,
        decision: null
      },
      {
        assessment_id: 'ASM-M08-02',
        assessment_at: '2025-05-12T10:40:00Z',
        stage: 'evidence',
        stage_label: 'Evidence',
        risk: { score: 34, band: 'medium' },
        decision: null
      },
      {
        assessment_id: 'ASM-M08-03',
        assessment_at: '2025-05-15T09:14:00Z',
        stage: 'received',
        stage_label: 'Warehouse',
        risk: { score: 61, band: 'high' },
        decision: null
      },
      {
        assessment_id: 'ASM-M08-04',
        assessment_at: '2025-05-15T09:21:00Z',
        stage: 'inspection',
        stage_label: 'Inspection',
        risk: { score: 82, band: 'critical' },
        decision: 'MANUAL_REVIEW'
      }
    ]
  },
  'RTN-LIVE-001': {
    items: [
      {
        assessment_id: 'ASM-LIVE-01',
        assessment_at: '2025-05-15T11:00:00Z',
        stage: 'requested',
        stage_label: 'Requested',
        risk: null,
        decision: null
      }
    ]
  },
  'RTN-S06-001': { items: [{ assessment_id: 'ASM-S06', assessment_at: '2025-05-14T16:30:00Z', stage: 'received', stage_label: 'Warehouse received', risk: { score: 46, band: 'medium' }, decision: 'REQUIRE_INSPECTION' }] },
  'RTN-L01-003': { items: [{ assessment_id: 'ASM-L01', assessment_at: '2025-05-15T08:05:00Z', stage: 'final', stage_label: 'Final', risk: { score: 12, band: 'low' }, decision: 'AUTO_APPROVE' }] },
  'RTN-COMP-004': { items: [{ assessment_id: 'ASM-COMP-1', assessment_at: '2025-05-10T08:00:00Z', stage: 'requested', stage_label: 'Requested', risk: null, decision: null }, { assessment_id: 'ASM-COMP-2', assessment_at: '2025-05-11T08:10:00Z', stage: 'final', stage_label: 'Final', risk: { score: 9, band: 'low' }, decision: 'AUTO_APPROVE' }] },
  'RTN-REJ-005': { items: [{ assessment_id: 'ASM-REJ-1', assessment_at: '2025-05-09T12:00:00Z', stage: 'requested', stage_label: 'Requested', risk: null, decision: null }, { assessment_id: 'ASM-REJ-2', assessment_at: '2025-05-12T12:20:00Z', stage: 'final', stage_label: 'Final', risk: { score: 94, band: 'critical' }, decision: 'REJECT_OR_ESCALATE' }] },
  'RTN-PEND-006': { items: [{ assessment_id: 'ASM-PEND-1', assessment_at: '2025-05-16T09:30:00Z', stage: 'requested', stage_label: 'Requested', risk: null, decision: null }] }
};

export const mockTimelineEventsMap: Record<string, TimelineEvent[]> = {
  'RTN-M08-002': [
    {
      id: 'EVT-1',
      title: 'Return requested: Item defect claimed',
      timestamp: '2025-05-12T10:21:00Z',
      facts: [
        'Reason recorded: Item defective / external damage claimed'
      ],
      source_indicator: 'Customer Portal',
      severity: 'normal'
    },
    {
      id: 'EVT-2',
      title: 'Customer uploaded photos',
      timestamp: '2025-05-12T10:35:00Z',
      facts: [
        'Damage visible on outer box packaging',
        'Outer carton seal appears disturbed'
      ],
      source_indicator: 'Evidence Store',
      severity: 'normal'
    },
    {
      id: 'EVT-3',
      title: 'Package received at warehouse',
      timestamp: '2025-05-15T09:14:00Z',
      facts: [
        'Weight captured: 1.246 kg',
        'Expected product weight: 1.200 kg (+3.8% delta)'
      ],
      source_indicator: 'Warehouse Scale',
      severity: 'normal'
    },
    {
      id: 'EVT-4',
      title: 'Serial number verification flag',
      timestamp: '2025-05-15T09:16:00Z',
      facts: [
        'Serial mismatch detected: Returned item does not match outbound order record',
        'Item present and accessories intact'
      ],
      source_indicator: 'Warehouse Station 4',
      severity: 'flag'
    }
  ],
  'RTN-LIVE-001': [
    {
      id: 'EVT-LIVE-1',
      title: 'Return requested by merchant',
      timestamp: '2025-05-15T11:00:00Z',
      facts: [
        'Reason: Changed my mind',
        'Source-backed return created from Order #4201'
      ],
      source_indicator: 'Operational Source Data',
      severity: 'normal'
    }
  ],
  'RTN-S06-001': [{ id: 'EVT-S06-1', title: 'Package received at warehouse', timestamp: '2025-05-14T16:25:00Z', facts: ['Physical inspection is required before a final decision'], source_indicator: 'Warehouse Intake', severity: 'normal' }],
  'RTN-L01-003': [{ id: 'EVT-L01-1', title: 'Warehouse inspection completed', timestamp: '2025-05-15T08:04:00Z', facts: ['Item present and condition recorded as salable', 'Accessory comparison found no missing accessories'], source_indicator: 'Warehouse Inspection', severity: 'normal' }],
  'RTN-COMP-004': [{ id: 'EVT-COMP-1', title: 'Return approved', timestamp: '2025-05-11T08:10:00Z', facts: ['Final assessment supports automatic approval'], source_indicator: 'Decision Service', severity: 'success' }],
  'RTN-REJ-005': [{ id: 'EVT-REJ-1', title: 'Return rejected and escalated', timestamp: '2025-05-12T12:20:00Z', facts: ['Final decision requires escalation'], source_indicator: 'Decision Service', severity: 'flag' }],
  'RTN-PEND-006': [{ id: 'EVT-PEND-1', title: 'Return requested', timestamp: '2025-05-16T09:30:00Z', facts: ['Reason recorded: Stopped working'], source_indicator: 'Controlled Scenario', severity: 'normal' }]
};

export function registerMockSourceBackedInvestigation(
  returnId: string,
  input: {
    order_id: number;
    order_item_id: number;
    user_id: number;
    product_id: number;
    product_name: string;
    product_category: string;
    sale_price: number;
    customer_name: string;
    reason: string;
    requested_at: string;
  }
) {
  mockInvestigationMap[returnId] = {
    return_id: returnId,
    source_type: 'source_backed',
    return: {
      ...input,
      status: 'requested',
      assessment_at: input.requested_at
    },
    customer: null,
    product: null,
    inspection: null,
    evidence: null,
    network: null,
    economics: { item_value: input.sale_price, reverse_logistics_cost: 0, inspection_cost: 0, recovery_value: 0, net_return_cost: 0 },
    risk: null,
    decision: null,
    vision: null,
    limitations: [
      'Assessment pending',
      'No warehouse inspection is available yet',
      'Visual assessment has not been performed'
    ]
  };
  mockAssessmentHistoryMap[returnId] = {
    items: [{ assessment_id: `ASM-${returnId}`, assessment_at: input.requested_at, stage: 'requested', stage_label: 'Requested', risk: null, decision: null }]
  };
  mockTimelineEventsMap[returnId] = [{
    id: `EVT-${returnId}`,
    title: 'Return requested',
    timestamp: input.requested_at,
    facts: [`Reason: ${input.reason}`, `Source-backed return created from Order #${input.order_id}`],
    source_indicator: 'Operational Source Data',
    severity: 'normal'
  }];
}
