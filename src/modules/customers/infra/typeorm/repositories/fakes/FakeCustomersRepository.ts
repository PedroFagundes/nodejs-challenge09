import { uuid } from 'uuidv4';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import Customer from '../../entities/Customer';

export default class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async create(customerData: ICreateCustomerDTO): Promise<Customer> {
    const customer = new Customer();

    Object.assign(customer, { id: uuid() }, customerData);

    this.customers.push(customer);

    return customer;
  }

  public async findById(costumer_id: string): Promise<Customer | undefined> {
    const foundCustomer = this.customers.find(
      customer => customer.id === costumer_id,
    );

    return foundCustomer;
  }

  public async findByEmail(
    costumer_email: string,
  ): Promise<Customer | undefined> {
    const foundCustomer = this.customers.find(
      customer => customer.email === costumer_email,
    );

    return foundCustomer;
  }
}
