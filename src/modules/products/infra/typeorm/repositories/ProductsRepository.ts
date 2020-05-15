import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const foundProduct = await this.ormRepository.findOne({ where: { name } });

    return foundProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsIds = products.map(product => product.id);

    const foundProducts = await this.ormRepository.find({
      where: { id: In(productsIds) },
    });

    return foundProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const foundProducts = await this.ormRepository.find({
      where: {
        id: In(products.map(product => product.id)),
      },
    });

    const updatedProducts = foundProducts.map(foundProduct => {
      const productIndex = products.findIndex(
        findProduct => findProduct.id === foundProduct.id,
      );

      const updatedProduct = new Product();

      Object.assign(updatedProduct, {
        ...foundProduct,
        quantity: foundProduct.quantity - products[productIndex].quantity,
      });

      return updatedProduct;
    });

    await this.ormRepository.save(updatedProducts);

    return updatedProducts;
  }
}

export default ProductsRepository;
