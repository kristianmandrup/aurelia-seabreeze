import query from './query';

const customersQuery = query()
  .from('Customers')
  .select('CustomerID, CompanyName')
  .orderBy('CompanyName');

const productsQuery = query()
  .from('Products')
  .select('ProductID, ProductName, UnitPrice')
  .orderBy('ProductName');

export default [
  {customers: customersQuery},
  {products: productsQuery}
]
