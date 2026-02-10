import { Injectable } from '@nestjs/common';

@Injectable()
export class EdiService {
  async createOrder(merchant, payload) {
    return {
      merchantId: merchant.merchantId,
      orderReference: payload.orderReference,
      trackingReference: 'TRK-' + Date.now(),
      status: 'CREATED',
    };
  }

  async getOrderStatus(merchant) {
    return {
      merchantId: merchant.merchantId,
      status: 'IN_TRANSIT',
    };
  }
}
