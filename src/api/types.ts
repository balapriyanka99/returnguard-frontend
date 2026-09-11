/**
 * ReturnGuard Core API Type Definitions
 * Frozen contracts matching the backend coordination specifications.
 */

export type SourceType = 'controlled' | 'source_backed';
export type RiskBand = 'low' | 'medium' | 'high' | 'critical';

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

// ------------------------------------------------------------
// Returns Listing
// ------------------------------------------------------------

export interface ReturnCustomerSummary {
  user_id: number;
  display_name: string;
}

export interface ReturnProductSummary {
  product_id: number;
  name: string;
  category: string;
  image_url: string | null;
}

export interface ReturnRiskSummary {
  score: number;
  band: RiskBand;
}

export interface ReturnSummaryItem {
  return_id: string;
  case_type?: 'CONTROLLED' | 'SOURCE_BACKED';
  source_type: SourceType;
  customer: ReturnCustomerSummary;
  order_id: number;
  order_item_id: number;
  product: ReturnProductSummary;
  reason: string;
  status: string;
  requested_at: string;
  assessment_at: string | null;
  risk: ReturnRiskSummary | null;
  decision?: string | null;
  previous_risk?: ReturnRiskSummary | null;
  reason_for_attention?: string;
}

export interface ReturnsListResponse {
  items: ReturnSummaryItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface ReturnsFilterParams {
  source_type?: SourceType;
  status?: string;
  risk_band?: RiskBand;
  limit?: number;
  offset?: number;
}

// ------------------------------------------------------------
// Dashboard
// ------------------------------------------------------------

export interface DashboardCounts {
  total_returns: number;
  controlled_returns: number;
  source_backed_returns: number;
  needs_review: number | null;
  auto_approved: number | null;
  rejected: number | null;
  awaiting_inspection?: number | null;
  completed?: number | null;
}

export interface DashboardRiskDistribution {
  low: number | null;
  medium: number | null;
  high: number | null;
}

export interface DashboardFinancials {
  potential_exposure: number | null;
  loss_prevented: number | null;
}

export interface DashboardResponse {
  counts: DashboardCounts;
  risk_distribution: DashboardRiskDistribution;
  financials: DashboardFinancials;
  recent_returns: ReturnSummaryItem[];
  attention_returns?: ReturnSummaryItem[];
}

// ------------------------------------------------------------
// Return Detail & Intelligence
// ------------------------------------------------------------

export interface ReturnDetailInfo {
  order_id: number;
  order_item_id: number;
  user_id: number;
  product_id: number;
  reason: string;
  status: string;
  requested_at: string;
  assessment_at: string | null;
  sale_price: number;
  product_name?: string;
  product_category?: string;
  product_image_url?: string | null;
  customer_name?: string;
}

export interface CustomerIntelligenceMetrics {
  tenure_months?: number;
  order_count?: number;
  total_spend?: number;
  return_count?: number;
  return_rate?: number;
  recent_return_count?: number;
  lifetime_value?: number;
  frequent_returner?: boolean;
  [key: string]: unknown;
}

export interface CustomerIntelligence {
  status: string;
  data_state: string;
  summary: string;
  metrics: CustomerIntelligenceMetrics;
  findings: string[];
  limitations: string[];
}

export interface ProductIntelligenceMetrics {
  historical_return_rate?: number;
  sample_count?: number;
  category_return_rate?: number;
  merchant_fault_rate?: number;
  sku?: string;
  top_reasons?: Array<{ reason: string; percentage: number }>;
  [key: string]: unknown;
}

export interface ProductIntelligence {
  status: string;
  data_state: string;
  summary: string;
  metrics: ProductIntelligenceMetrics;
  findings: string[];
  limitations: string[];
}

export interface InspectionData {
  available: boolean;
  item_present: boolean;
  condition: string;
  expected_weight_kg: number | null;
  actual_weight_kg: number | null;
  weight_delta_kg: number | null;
  weight_ratio: number | null;
  serial_comparison_performed: boolean;
  serial_mismatch: boolean | null;
  accessory_comparison_performed: boolean;
  missing_accessories: string[];
  inspected_at: string;
}

export interface EvidenceItem {
  evidence_id: string;
  evidence_type: 'image' | 'document' | 'video' | string;
  stage: string;
  observed_at: string;
  display_url: string | null;
  title?: string;
  notes?: string;
}

export interface EvidenceData {
  available: boolean;
  items: EvidenceItem[];
}

export interface NetworkRelationship {
  target_id: string;
  relationship_type: string;
  strength?: string;
  details?: string;
}

export interface NetworkContextData {
  available: boolean;
  contextual_evidence_only: boolean;
  relationship_count: number;
  relationships: NetworkRelationship[];
  cluster_notes?: string;
}

export interface EconomicsData {
  item_value: number;
  product_cost?: number;
  reverse_logistics_cost: number;
  inspection_cost: number;
  recovery_value: number;
  net_return_cost: number;
  calculation_at?: string;
}

export interface SignalContribution {
  name: string;
  severity: 'low' | 'medium' | 'high';
  supporting_fact: string;
  source: string;
  contribution_pct?: number;
}

export interface RiskData {
  score: number;
  band: RiskBand;
  coverage?: string;
  group_scores?: Record<string, number>;
  product_mitigation?: number;
  reason_codes: string[];
  signal_contributions: SignalContribution[];
  patterns?: string[];
  limitations: string[];
}

export interface DecisionData {
  recommended_action: string;
  confidence: number | string;
  policy_name?: string;
  policy_version?: string;
  policy_explanation?: string;
  suggested_fee?: number;
  verification_level?: string;
  refund_timeline?: string;
  limitations: string[];
  status: string;
  matched_policy_rule?: string;
  strongest_evidence?: string[];
  mitigating_context?: string[];
}

export interface VisionFinding {
  observed_defect?: string;
  confidence?: number;
  notes?: string;
}

export interface VisionData {
  status: string;
  findings: VisionFinding[];
  summary?: string;
}

export interface ReturnDetailResponse {
  return_id: string;
  source_type: SourceType;
  return: ReturnDetailInfo;
  customer: CustomerIntelligence | null;
  product: ProductIntelligence | null;
  inspection: InspectionData | null;
  evidence: EvidenceData | null;
  network: NetworkContextData | null;
  economics: EconomicsData | null;
  risk: RiskData | null;
  decision: DecisionData | null;
  vision: VisionData | null;
  limitations: string[];
  evidence_coverage?: 'sufficient' | 'partial' | 'insufficient' | 'pending';
}

// ------------------------------------------------------------
// Timeline / Assessment History
// ------------------------------------------------------------

export interface AssessmentHistoryItem {
  assessment_id: string;
  assessment_at: string;
  stage: string; // 'requested' | 'photos' | 'in_transit' | 'received' | 'inspection' | 'final'
  stage_label?: string;
  risk: {
    score: number;
    band: RiskBand;
  } | null;
  decision: string | null;
}

export interface AssessmentHistoryResponse {
  items: AssessmentHistoryItem[];
}

export interface AssessReturnRequest {
  assessment_at: string;
}

export interface AssessReturnResponse {
  assessment_id: string;
  return_id: string;
  assessment_at: string;
  status: string;
  risk: RiskData | null;
  decision: DecisionData | null;
  vision: VisionData | null;
}

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  facts: string[];
  source_indicator: string;
  severity?: 'normal' | 'flag' | 'success';
}

export type ManualReviewAction =
  | 'APPROVE'
  | 'REJECT'
  | 'REQUEST_MORE_EVIDENCE'
  | 'REQUIRE_PHYSICAL_INSPECTION'
  | 'ESCALATE';

export interface ManualReviewState {
  action: ManualReviewAction;
  notes?: string;
  updated_at: string;
}

export type DemoLifecycleEvent = 'pickup_complete' | 'warehouse_received';

export interface DemoLifecycleState {
  status: string;
  updated_at: string;
  events: TimelineEvent[];
}

export interface InspectionDraft {
  inspection: InspectionData;
  inspector_notes?: string;
}

// ------------------------------------------------------------
// Source-backed Return Creation
// ------------------------------------------------------------

export interface SourceCustomer {
  user_id: number;
  display_name: string;
  email?: string;
}

export interface SourceCustomersResponse {
  items: SourceCustomer[];
}

export interface SourceOrder {
  order_id: number;
  created_at: string;
  status: string;
  num_of_item: number;
}

export interface SourceOrdersResponse {
  items: SourceOrder[];
}

export interface SourceOrderItem {
  order_item_id: number;
  product_id: number;
  product_name: string;
  category: string;
  sale_price: number;
  image_url: string | null;
}

export interface SourceOrderItemsResponse {
  items: SourceOrderItem[];
}

export interface CreateReturnRequest {
  order_item_id: number;
  customer_id?: number;
  order_id?: number;
  reason: string;
  comment?: string;
}

export interface CreateReturnResponse {
  return_id: string;
  source_type: 'source_backed';
  status: string;
  requested_at: string;
  assessment_at: string | null;
}

// ------------------------------------------------------------
// Ask ReturnGuard (Copilot)
// ------------------------------------------------------------

export interface AskReturnGuardRequest {
  question: string;
  assessment_at?: string;
}

export interface KeyEvidenceItem {
  tool_name: string;
  facts: Record<string, unknown>;
  data_origin: string;
}

export interface AskReturnGuardResponse {
  return_id: string;
  assessment_at: string;
  status: string;
  answer: string;
  tools_used: string[];
  key_evidence: KeyEvidenceItem[];
  limitations: string[];
  trace_id?: string;
  assessment_id?: string;
}
