/**
* Creates Breeze EntityManager instances.
*/
import { singleton } from 'aurelia-framework';
import { logChanges } from './logger';

@singleton
export class EntityManagerFactory {
  defaultLogger = logChanges;

  constructor(settings = {}) {
    if (this.entityManager) {
      return Promise.resolve(this.copyEntityManager()); 
    }

    this.logger = settings.logger || this.defaultLogger; 
    this.settings = settings;
    this.entityManager = new breeze.EntityManager(settings.serviceName);
    return this.entityManager.fetchMetadata()
      .then(() => this.copyEntityManager());
  }

  get logChanges() {
    return this.logger || this.defaultLogger;
  }

  copyEntityManager() {
    const copy = this.entityManager.createEmptyCopy();
    copy.entityChanged.subscribe(this.logChanges);
    return copy;
  }
}
