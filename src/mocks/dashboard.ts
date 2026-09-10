import { DashboardResponse } from '../api/types';
import { mockReturnsList } from './returns';

export const mockDashboardData: DashboardResponse = {
  counts: {
    total_returns: 82,
    controlled_returns: 80,
    source_backed_returns: 2,
    needs_review: null,
    auto_approved: null,
    rejected: null
  },
  risk_distribution: {
    low: null,
    medium: null,
    high: null
  },
  financials: {
    potential_exposure: null,
    loss_prevented: null
  },
  recent_returns: mockReturnsList
};
