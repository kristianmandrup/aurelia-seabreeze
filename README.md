# Aurelia Seabreeze

A small library to quickly get rocking with [aurelia-breeze](https://github.com/jdanyow/aurelia-breeze).
Based on the sample northwind app: [aurelia-breeze-northwind](https://github.com/jdanyow/aurelia-breeze-northwind) and tried
to make the code more abstract/general and thus easily reusable for different entities.

## Install

`npm i aurelia-seabreeze --save`

## Usage

You will need to create the following:

- Section
- Service (with service queries)
- Entity lookups (with lookup queries)
- Entity VM

### Create a section 

The section is the entry point for the entity and contains a child-router

```js
class OrderSection extends EntitySection {
  constructor() {
    super('order);
  }
}
```

Define your Service queries. You need a `list` query and one or more queries for `id`.

Example:

```js
// service-queries.js

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
```

Create an entity service: `OrderService`

```js
import { EntityService } from 'aurelia-seabreeze';
import { serviceQueries } from './service-queries';

class OrderService extends EntityService {
   constructor() {
     super('order', serviceQueries, orderQueries);
   } 
}
```

Create your Entity lookup queries:

```js
// lookup-queries.js

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
```

And your Lookups aggregator

```js
import lookupQueries from './lookup-queries';
import { Lookups } from 'aurelia-seabreeze';
export class EntityLookups extends Lookups { 
  constructor() {
    this.lookupQueries = lookupQueries;
  }
}
```

Then create an `Order` VM injecting your `OrderService` and `EntityLookups` as singletons.

```js
import {OrderService} from './order-service';
import {EntityLookups} from './entity-lookups';

@inject(OrderService, EntityLookups)
class Order extends Entity {
  constructor(service, lookups) {
    super('order', service, lookups);
  }
}
```

And you are good to go!!

PS: This is experimental! Let me know how it works out for you ;)

## Notes

The included files: `queries.js` and `section/service-queries.js` are simply there to demonstrate the type of formats you should use.