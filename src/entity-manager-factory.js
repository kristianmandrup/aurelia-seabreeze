/**
* Creates Breeze EntityManager instances.
*/
import { singleton } from 'aurelia-framework';

@singleton
export class EntityManager {
  constructor(settings = {}) {
    if (this.entityManager) {
      return Promise.resolve(this.copyEntityManager()); 
    }

    this.settings = settings;
    this.entityManager = new breeze.EntityManager(settings.serviceName);
    return this.entityManager.fetchMetadata()
      .then(() => this.copyEntityManager());
  }

  copyEntityManager() {
    const copy = this.entityManager.createEmptyCopy();
    copy.entityChanged.subscribe(this.logChanges);
    return copy;
  }

  // log entity changes to the console for debugging purposes.
  logChanges(data) {
    var message = 'Entity Changed.  Entity: ' + (data.entity ? data.entity.entityType.name + '/' + data.entity.entityAspect.getKey().toString() : '?') + ';  EntityAction: ' + data.entityAction.getName() + '; ';
    if (data.entityAction === breeze.EntityAction.PropertyChange) {
      var pcArgs = data.args;
      message += 'PropertyName: ' + (pcArgs.propertyName || 'null') + '; Old Value: ' + (pcArgs.oldValue ? pcArgs.oldValue.toString() : 'null') + '; New Value: ' + (pcArgs.newValue ? pcArgs.newValue.toString() : 'null') + ';';
    }
    if (data.entityAction === breeze.EntityAction.EntityStateChange) {
      message += 'New State: ' + data.entity.entityAspect.entityState.getName() + ';';
    }
    console.log(message);
  }
}
