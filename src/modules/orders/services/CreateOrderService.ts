import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Invalid customer ID');
    }

    const foundProducts = await this.productsRepository.findAllById(products);

    if (foundProducts.length !== products.length) {
      throw new AppError('There is an invalid product on this order');
    }

    const orderProducts = products.map(product => {
      const productObj = foundProducts.find(
        foundProduct => foundProduct.id === product.id,
      );

      if (!productObj) {
        throw new AppError('Internal server error');
      }

      if (productObj.quantity < product.quantity) {
        throw new AppError(
          'There is a product with insuficient quantity on this order',
        );
      }

      const orderProduct = {
        product_id: productObj.id,
        price: productObj.price,
        quantity: product.quantity,
      };

      return orderProduct;
    });

    const order = this.ordersRepository.create({
      customer,
      products: orderProducts,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateProductService;
