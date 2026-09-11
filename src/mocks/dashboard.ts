import { DashboardResponse } from '../api/types';
import { mockReturnsList } from './returns';

export const mockDashboardData: DashboardResponse = {
  counts: {
    total_returns: mockReturnsList.length,
    controlled_returns: mockReturnsList.filter((item) => item.source_type === 'controlled').length,
    source_backed_returns: mockReturnsList.filter((item) => item.source_type === 'source_backed').length,
    needs_review: mockReturnsList.filter((item) => item.status.toLowerCase().includes('review')).length,
    auto_approved: mockReturnsList.filter((item) => item.decision === 'AUTO_APPROVE').length,
    rejected: mockReturnsList.filter((item) => item.decision === 'REJECT_OR_ESCALATE').length,
    awaiting_inspection: mockReturnsList.filter((item) => item.status.toLowerCase().includes('awaiting physical inspection')).length,
    completed: mockReturnsList.filter((item) => item.status.toLowerCase().includes('completed')).length
  },
  risk_distribution: {
    low: mockReturnsList.filter((item) => item.risk?.band === 'low').length,
    medium: mockReturnsList.filter((item) => item.risk?.band === 'medium').length,
    high: mockReturnsList.filter((item) => item.risk?.band === 'high' || item.risk?.band === 'critical').length
  },
  financials: {
    potential_exposure: null,
    loss_prevented: null
  },
  recent_returns: mockReturnsList
};
