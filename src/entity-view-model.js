export class EntityViewModel {
  service;
  entityManager;
  entity;

  constructor(service) {
    this.service = service;
  }

  activate(info) {
    var promise;

    // load or create the entity.
    if (info.id === 'new') {
      promise = this.service.createNew();
    } else {
      promise = this.service.loadExisting(info.id);
    }

    return promise.then(result => {
      this.entityManager = result.entityManager;
      this.entity = result.entity;
    });
  }

  message(msg) {
    console.log(msg);
    // Materialize.toast(msg, 2000);
  }

  canDeactivate() {
    // permit navigating away from new entities.
    if (this.entity.entityAspect.entityState.isAdded()) {
      this.message('Add-new cancelled');
      return true;
    }

    // disallow navigating away from modified entities.
    if (this.hasChanges) {
      // throttle the amount of toast we pop.
      if (!this._lastPop || +new Date() - this._lastPop > 2000) {
        this._lastPop = +new Date();
        this.message('Navigation cancelled.  Save your changes!');
      }
      return false;
    }

    // permit navigating away from unmodified entities.
    return true;
  }

  get hasChanges() {
    return this.entityManager.hasChanges();
  }

  save() {
    // fake save...
    this.entityManager.acceptChanges();
    this.message('Changes saved.')
  }

  revert() {
    this.entityManager.rejectChanges();
    this.message('Changes reverted.')

    // workaround Materialize datepicker binding timezone issue.
    if (this.hasChanges) {
      this.entityManager.rejectChanges();
    }
  }
}
