const pagedList = new breeze.EntityQuery
      .from('Orders')
      .select('OrderID, Customer.CompanyName, Employee.FirstName, Employee.LastName, OrderDate, Freight')
      .orderByDesc('OrderDate')
      .skip(pageIndex * settings.pageSize)
      .take(settings.pageSize)
      .inlineCount();

const entityById = new breeze.EntityQuery().from('Orders').where('OrderID', '==', id);

const entityDetailsById =new breeze.EntityQuery().from('OrderDetails').where('OrderID', '==', id)

export default {
  order: {
    list: pagedList,
    id: [entityById, entityDetailsById]
  }
} 