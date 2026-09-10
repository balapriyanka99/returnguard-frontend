import { config, apiFetch } from './client';
import { AskReturnGuardRequest, AskReturnGuardResponse } from './types';

export async function askReturnGuard(
  returnId: string,
  request: AskReturnGuardRequest
): Promise<AskReturnGuardResponse> {
  if (config.useMock) {
    await new Promise((res) => setTimeout(res, 300));
    if (returnId !== 'RTN-M08-002') {
      return {
        return_id: returnId,
        assessment_at: request.assessment_at || new Date().toISOString(),
        status: 'completed',
        answer: 'This return is awaiting additional investigation data. No suspiciousness score, inspection conclusion, vision finding, or policy recommendation is currently available.',
        tools_used: [],
        key_evidence: [],
        limitations: ['Assessment pending', 'No warehouse inspection is available yet']
      };
    }
    return {
      return_id: returnId,
      assessment_at: request.assessment_at || new Date().toISOString(),
      status: 'completed',
      answer:
        'Warehouse inspection records that the item is present and that the serial comparison resulted in a mismatch. Customer history and one network relationship are also available as context. Suspiciousness risk and a policy recommendation have not yet been established, so these facts should be reviewed without treating them as a fraud conclusion.',
      tools_used: ['get_customer_intelligence', 'get_return_inspection', 'get_network_context'],
      key_evidence: [
        {
          tool_name: 'get_return_inspection',
          facts: {
            serial_mismatch: true,
            item_present: true,
            weight_delta_kg: 0.046
          },
          data_origin: 'warehouse_inspection'
        },
        {
          tool_name: 'get_customer_intelligence',
          facts: {
            return_rate: 0.147,
            recent_return_count: 2
          },
          data_origin: 'live_source'
        }
      ],
      limitations: ['Carrier transit weigh-in data was not recorded at dropoff']
    };
  }

  return apiFetch<AskReturnGuardResponse>(
    `/api/returns/${encodeURIComponent(returnId)}/ask`,
    {
      method: 'POST',
      body: JSON.stringify(request)
    }
  );
}
