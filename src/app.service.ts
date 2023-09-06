import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): string {
    return 'Pricing Backend Server running! 🚀';
  }
}
