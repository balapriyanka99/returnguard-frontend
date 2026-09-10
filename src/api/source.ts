import { config, apiFetch } from './client';
import {
  SourceCustomersResponse,
  SourceOrdersResponse,
  SourceOrderItemsResponse,
  CreateReturnRequest,
  CreateReturnResponse
} from './types';
import {
  mockSourceCustomers,
  mockSourceOrders,
  mockSourceOrderItems
} from '../mocks';
import { mockReturnsList } from '../mocks/returns';
import { registerMockSourceBackedInvestigation } from '../mocks/investigations';

export async function getSourceCustomers(search?: string): Promise<SourceCustomersResponse> {
  if (config.useMock) {
    await new Promise((res) => setTimeout(res, 80));
    let items = [...mockSourceCustomers];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.display_name.toLowerCase().includes(q) ||
          String(c.user_id).includes(q) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }
    return { items };
  }

  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiFetch<SourceCustomersResponse>(`/api/source/customers${qs}`);
}

export async function getSourceCustomerOrders(userId: number): Promise<SourceOrdersResponse> {
  if (config.useMock) {
    await new Promise((res) => setTimeout(res, 80));
    const items = mockSourceOrders[userId] || [];
    return { items };
  }

  return apiFetch<SourceOrdersResponse>(`/api/source/customers/${userId}/orders`);
}

export async function getSourceOrderItems(orderId: number): Promise<SourceOrderItemsResponse> {
  if (config.useMock) {
    await new Promise((res) => setTimeout(res, 80));
    const items = mockSourceOrderItems[orderId] || [];
    return { items };
  }

  return apiFetch<SourceOrderItemsResponse>(`/api/source/orders/${orderId}/items`);
}

export async function createSourceReturn(
  payload: CreateReturnRequest
): Promise<CreateReturnResponse> {
  if (config.useMock) {
    await new Promise((res) => setTimeout(res, 200));
    const newId = `RTN-LIVE-${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();
    const item = Object.values(mockSourceOrderItems).flat().find((candidate) => candidate.order_item_id === payload.order_item_id);
    const orderEntry = Object.entries(mockSourceOrderItems).find(([, items]) => items.some((candidate) => candidate.order_item_id === payload.order_item_id));
    const orderId = orderEntry ? Number(orderEntry[0]) : 0;
    const customerEntry = Object.entries(mockSourceOrders).find(([, orders]) => orders.some((order) => order.order_id === orderId));
    const userId = customerEntry ? Number(customerEntry[0]) : 0;
    const customer = mockSourceCustomers.find((candidate) => candidate.user_id === userId);
    if (!item || !orderId || !customer) throw new Error('The selected order item is not available in the source snapshot');
    mockReturnsList.unshift({
      return_id: newId,
      source_type: 'source_backed',
      customer: { user_id: userId, display_name: customer.display_name },
      order_id: orderId,
      order_item_id: item.order_item_id,
      product: { product_id: item.product_id, name: item.product_name, category: item.category, image_url: item.image_url },
      reason: payload.reason,
      status: 'requested',
      requested_at: nowIso,
      assessment_at: nowIso,
      risk: null
    });
    registerMockSourceBackedInvestigation(newId, {
      order_id: orderId,
      order_item_id: item.order_item_id,
      user_id: userId,
      product_id: item.product_id,
      product_name: item.product_name,
      product_category: item.category,
      sale_price: item.sale_price,
      customer_name: customer.display_name,
      reason: payload.reason,
      requested_at: nowIso
    });
    return {
      return_id: newId,
      source_type: 'source_backed',
      status: 'requested',
      requested_at: nowIso,
      assessment_at: nowIso
    };
  }

  return apiFetch<CreateReturnResponse>('/api/returns', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
