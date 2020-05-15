import CreateCustomerService from './CreateCustomerService';
import CustomersRepository from '../infra/typeorm/repositories/CustomersRepository';

describe('CreateCustomer', () => {
  it('should be able to create a new customer', async () => {
    const customerRepository = new CustomersRepository();
    const createCustomer = new CreateCustomerService(customerRepository);

    const user = createCustomer.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
    });

    expect(user).toHaveProperty('id');
  });
});
