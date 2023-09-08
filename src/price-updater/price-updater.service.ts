import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pack, Product } from './entities/price-updater.entity';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PriceUpdaterService {
  constructor(private readonly prisma: PrismaService) {}

  getProduct = async (code: number | bigint) => {
    const product = await this.prisma.products.findUnique({
      where: {
        code,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  };

  getPackByProductId = async (product_id: number | bigint) => {
    return await this.prisma.packs.findFirst({
      where: {
        product_id,
      },
    });
  };

  getPackByPackId = async (pack_id: number | bigint) => {
    return await this.prisma.packs.findMany({
      where: {
        pack_id,
      },
    });
  };

  async findAllProducts(): Promise<Product | Product[]> {
    return await this.prisma.products.findMany();
  }

  async findProductsAndPack(code: number): Promise<[Product[], Pack[]]> {
    let products: Product[] = [];
    let packs: Pack[] = [];

    await Promise.all([
      this.getProduct(code),
      this.getPackByProductId(code),
    ]).then((value) => {
      products.push(value[0]);
      packs.push(value[1]);
    });

    if (packs[0]) {
      packs = await this.getPackByPackId(packs[0].pack_id);
    }

    if (packs.length > 1) {
      products = [];
      for (const pack of packs) {
        const insertProduct = await this.getProduct(pack.product_id);
        products.push(insertProduct);
      }
    }

    return [products, packs];
  }

  async updateProduct(code: number, new_sales_price: Decimal): Promise<string> {
    const product = await this.getProduct(code);
    console.log(
      '🚀 ~ file: price-updater.service.ts:55 ~ PriceUpdaterService ~ updateProduct ~ product:',
      product,
    );

    // FINANCIAL RULES
    if (+product[0].cost_price > +new_sales_price)
      throw new NotAcceptableException(
        'The sales price should be lower than the cost price',
      );

    // MARKETING RULES
    if (
      +product[0].sales_price * 1.1 < +new_sales_price ||
      +product[0].sales_price * 0.9 > +new_sales_price
    )
      throw new NotAcceptableException(
        'The price cannot flutuate more than 10%',
      );

    // IF IT IS A PRODUCT IN PACK RULES

    // IF IT IS A PACK TO PRODUCT UPDATE

    //UPDATE PRODUCT
    await this.prisma.products.update({
      where: {
        code,
      },
      data: {
        sales_price: new_sales_price,
      },
    });

    return 'Product updated';
  }
}
