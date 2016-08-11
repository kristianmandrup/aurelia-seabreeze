import breeze from 'breeze';

const customersQuery = new breeze.EntityQuery
  .from('Customers')
  .select('CustomerID, CompanyName')
  .orderBy('CompanyName');

const productsQuery = new breeze.EntityQuery
  .from('Products')
  .select('ProductID, ProductName, UnitPrice')
  .orderBy('ProductName');

export default [
  {customers: customersQuery},
  {products: productsQuery}
]
