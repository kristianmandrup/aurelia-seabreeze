import {ListViewModel} from '../list-view-model';
// import {AppRouter} from 'aurelia-router';
// import {EntityService} from './order-service';
// import {inject, singleton} from 'aurelia-dependency-injection';

// @inject(AppRouter, EntityService)
// @singleton()
export class EntityList extends ListViewModel {
  constructor(name, router, service) {
    super(name, router, service)
  }
}
