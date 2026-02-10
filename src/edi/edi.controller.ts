import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTokenGuard } from '../guards/api-token.guard';
import { EdiService } from './edi.service';

@Controller('api/edi/orders')
@UseGuards(ApiTokenGuard)
export class EdiController {
  constructor(private readonly ediService: EdiService) { }

  @Post('create')
  createOrder(@Req() req, @Body() body) {
    return this.ediService.createOrder(req.merchant, body);
  }

  @Get('status')
  getStatus(@Req() req) {
    return this.ediService.getOrderStatus(req.merchant);
  }
}
