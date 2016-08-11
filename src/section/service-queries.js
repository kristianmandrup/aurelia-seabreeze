import query from '../query';

const pagedList = query()
      .from('Orders')
      .select('OrderID, Customer.CompanyName, Employee.FirstName, Employee.LastName, OrderDate, Freight')
      .orderByDesc('OrderDate')
      .skip(pageIndex * settings.pageSize)
      .take(settings.pageSize)
      .inlineCount();

function queriesById({id}) {
  return [
    query().from('Orders').where('OrderID', '==', id),
    query().from('OrderDetails').where('OrderID', '==', id)
  ]
}
 
export default {
  order: {
    list: pagedList,
    oneBy: queriesById
  }
} 