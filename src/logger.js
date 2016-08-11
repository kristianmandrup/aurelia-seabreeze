  // log entity changes to the console for debugging purposes.
export function logChanges(data) {
  let message = 'Entity Changed.  Entity: ' + (data.entity ? data.entity.entityType.name + '/' + data.entity.entityAspect.getKey().toString() : '?') + ';  EntityAction: ' + data.entityAction.getName() + '; ';
  if (data.entityAction === breeze.EntityAction.PropertyChange) {
    let pcArgs = data.args;
    message += 'PropertyName: ' + (pcArgs.propertyName || 'null') + '; Old Value: ' + (pcArgs.oldValue ? pcArgs.oldValue.toString() : 'null') + '; New Value: ' + (pcArgs.newValue ? pcArgs.newValue.toString() : 'null') + ';';
  }
  if (data.entityAction === breeze.EntityAction.EntityStateChange) {
    message += 'New State: ' + data.entity.entityAspect.entityState.getName() + ';';
  }
  console.log(message);
}
