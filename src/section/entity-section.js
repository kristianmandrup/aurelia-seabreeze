/**
* The shell for the orders section of the application.  Will contain either
* the order-list or order page.

  class OrderSection extends EntitySection {
    constructor() {
      super('order');
    }
  }

*/
export class EntitySection {
  constructor(entityName) {
    this.entityName = entityName;
  }

  configureRouter(config, router) {
    config.map([
      { route: '',    moduleId: `./${this.entityName}-list`, nav: false, title: '' },
      { route: ':id', moduleId: `./${this.entityName}`,      nav: false, title: '' },
    ]);
  }
}


