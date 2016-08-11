import {EntityViewModel} from '../entity-view-model';
import capitalize from 'lodash/capitalize';
//import {inject} from 'aurelia-dependency-injection';

// @inject(EntityService, Lookups)
export class Entity extends EntityViewModel {
  constructor(name, service, lookups) {
    super(service);
    this.lookups = lookups;
    this.name = name;
  }

  get className() {
    return capitalize(this.name);
  }

  get title() {
    if (this.entity.id <= 0) {
      return `New ${this.className}`;
    }
    return `${this.className} #${this.entity.id}`;
  }
}
