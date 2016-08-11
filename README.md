# Aurelia Seabreeze

A small library to quickly get rocking with [aurelia-breeze](https://github.com/jdanyow/aurelia-breeze).
Based on the sample northwind app: [aurelia-breeze-northwind](https://github.com/jdanyow/aurelia-breeze-northwind) and tried
to make the code more abstract/general and thus easily reusable for different entities.

## Install

`npm i aurelia-seabreeze --save`

## Usage

You will need to create the following:

- EntityManager factory method
- Section with entity router
- Service (with service queries)
- Entity lookups (with lookup queries)
- Entity VM
- Entities VM

Then you can create views for your VMs as you find appropriate to display/manage your entity data

### EntityManager factory

breeze settings for `EntityManager`

```js
// settings.js

export default {
  serviceName: "http://sampleservice.breezejs.com/api/northwind",
  pageSize: 100,
};
```

For the `EntityManager` factory method we use our settings.

```js
// createEntityManager.js

import settings from './settings';
import { EntityManagerFactory } from 'aurelia-seabreeze';

export createEntityManager() {
  return new EntityManagerFactory(settings).entityManager;
} 
```

Note that the settings can also include a `logger` entry which provides a logger function `logChanges(data)`. 
See `src/logger.js` for the default logger provided. 

### Entity Section 

The `OrderSection` is the entry point for the Order entity is itself a child-router

```js
// orders/order-sections

import { EntitySection } from 'aurelia-seabreeze'; 

class OrderSection extends EntitySection {
  constructor() {
    super('order');
  }
}
```

It will create a router with the following routes, defined in the getter `routeMap` (override if you need to).

```js
  { route: '',    moduleId: `./order-list`, nav: false, title: '' },
  { route: ':id', moduleId: `./order`,      nav: false, title: '' },
```

### Service queries 

You should create a (possibly paged) `list` query and one or more queries to retrieve one entity (usually by `id`).

Example:

```js
// service-queries.js

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
```

### Entity service

We create an `OrderService` for the `Order` entity

```js
import { EntityService } from 'aurelia-seabreeze';
import { serviceQueries } from './service-queries';
import { createEntityManager } from './entity-manager'

class OrderService extends EntityService {
  constructor() {
    super('order');
  } 

  get queries() {
    return serviceQueries;
  }

  get entityManager() {
    return createEntityManager();
  }
}
```

### Entity lookup queries:

```js
// lookup-queries.js

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
```

We use this to create an `EntityLookups` aggregator

```js
// lookups.js

import lookupQueries from './lookup-queries';
import { Lookups } from 'aurelia-seabreeze';

export class EntityLookups extends Lookups { 
  get entityManager() {
    return createEntityManager();
  }

  get lookupQueries() {
    return lookupQueries;
  }
}
```

### Entity VM

For the `Order` VM we inject `OrderService` and `EntityLookups` as singletons.

```js
import { Entity } from 'aurelia-seabreeze';
import { OrderService } from './order-service';
import { EntityLookups } from './entity-lookups';

@inject(OrderService, EntityLookups)
class Order extends Entity {
  constructor(service, lookups) {
    super('order', service, lookups);
  }
}
```

### Entities VM

Then create an `Order` VM injecting `OrderService` and `Router`.
We also pass the plural entity name as the route, ie. `orders` and optionally some settings, such as `pageSize` 

```js
import { EntityList } from 'aurelia-seabreeze';
import {OrderService} from './order-service';
import {Router} from './aurelia-framework';

@inject(Router, OrderService)
class OrderList extends EntityList {
  constructor(router, service}) {
    super('orders', router, service, {pageSize: 50})
  }  
}
```

Now we are good to go!!

PS: This is still very experimental! Let me know how it works out for you ;)

## Notes

The included src files: `lookup-queries.js` and `section/service-queries.js` are simply there to demonstrate 
how these queries should be defined and exported for use.