import breeze from 'breeze';

const pagedList = new breeze.EntityQuery()
      .from('Orders')
      .select('OrderID, Customer.CompanyName, Employee.FirstName, Employee.LastName, OrderDate, Freight')
      .orderByDesc('OrderDate')
      .skip(pageIndex * settings.pageSize)
      .take(settings.pageSize)
      .inlineCount();

function queriesById({id}) {
  return [
    new breeze.EntityQuery().from('Orders').where('OrderID', '==', id),
    new breeze.EntityQuery().from('OrderDetails').where('OrderID', '==', id)
  ]
}
 
export default {
  order: {
    list: pagedList,
    oneBy: queriesById
  }
} 