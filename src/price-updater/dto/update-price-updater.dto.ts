import { PartialType } from '@nestjs/mapped-types';
import { CreatePriceUpdaterDto } from './create-price-updater.dto';

export class UpdatePriceUpdaterDto extends PartialType(CreatePriceUpdaterDto) {}
