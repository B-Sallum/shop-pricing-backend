import { Decimal } from "@prisma/client/runtime/library";

export class Packs {
  id: bigint;
  pack_id: bigint;
  product_id: bigint;
  qty: bigint;
}

export class Product {
  code: bigint;
  name: string;
  cost_price: Decimal;
  sales_price: Decimal;
}
