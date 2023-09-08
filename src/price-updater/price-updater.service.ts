import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pack, Product } from './entities/price-updater.entity';

@Injectable()
export class PriceUpdaterService {
  constructor(private readonly prisma: PrismaService) {}

  getProduct = async (code: number | bigint) => {
    const product = await this.prisma.products.findUnique({
      where: {
        code,
      },
    });

    if (!product) throw new NotFoundException('Produto não encontrado');

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

  async updateProduct(code: number, new_sales_price: number): Promise<string> {
    let product: Product = null;
    let isInAPack: Pack[] = null;
    let completePack: [Product[], Pack[]] = null;

    if (code.toString().length < 4) {
      product = await this.getProduct(code);
    } else {
      const productsInPack = await this.getPackByPackId(code);
      if (productsInPack.length > 1) {
        throw new NotFoundException(
          `Este código contém múltiplos produtos e não pode ser atualizado pelo código do pack. Atualize os preços de cada produto separadamente e o valor total do pack será atualizado automaticamente`,
        );
      } else {
        product = await this.getProduct(code);
      }
    }

    // FINANCIAL RULES
    if (+product.cost_price > new_sales_price)
      throw new NotAcceptableException(
        'O preço de venda deve ser maior que o preço de custo',
      );

    // MARKETING RULES ~10%
    if (
      +product.sales_price * 1.1 < new_sales_price ||
      +product.sales_price * 0.9 > new_sales_price
    )
      throw new NotAcceptableException('O preço não deve variar mais que 10%');

    // IF PRODUCT IN PACK RULES
    // if (code.toString().length === (2 || 3)) {
    //   if (completePack[1].length === 1) {
    //     console.log('produto em pack de 1 produto');
    //   } else if (completePack[1].length > 1) {
    //     console.log('produto em pack com vários produtos');
    //   }
    // } else {
    //   if (completePack[1].length > 1) {
    //     console.log('pack com várias unidades de 1 produto');
    //   } else {
    //     console.log('pack com vários produtos e unidades');
    //   }
    // }

    // if (isInAPack) {
    //   completePack = await this.findProductsAndPack(code);
    //   console.log(
    //     '🚀 ~ file: price-updater.service.ts:94 ~ PriceUpdaterService ~ updateProduct ~ completePack:',
    //     completePack,
    //   );
    // }

    //UPDATE PRODUCT
    await this.prisma.products.update({
      where: {
        code,
      },
      data: {
        sales_price: new_sales_price,
      },
    });

    return 'Preço do produto atualizado com sucesso';
  }
}
