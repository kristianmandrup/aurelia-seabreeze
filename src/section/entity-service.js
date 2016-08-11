import breeze from 'breeze';
import settings from '../settings';
import {createEntityManager} from '../entity-manager-factory';
import queries from './service-queries';
import capitalize from 'lodash/capitalize';

export class EntityService {
  constructor(entityName, queries, {pageCount, pageSize}) {
    this.entityName = entityName;
    this.pageCount = pageCount; 
    this.pageSize = pageSize || this.defaultPageSize;
  }

  get defaultPageSize() {
    return 20;
  }

  get calcPageCount(queryResult) {
    return Math.ceil(queryResult.inlineCount / this.pageSize)
  }

  getPage(pageIndex) {
    return createEntityManager()
      .then(em => em.executeQuery(this.queries.list))
      .then(queryResult => {
        return {
          entities: queryResult.results,
          pageCount: this.pageCount || this.calcPageCount(queryResult)
        };
      });
  }

  get resourceName() {
    return capitalize(this.name);
  }

  get queries() {
    return queries[this.entityName];
  }

  promisedQueries(em) {
    return queries.byId.map(query => em.executeQuery(query));
  }
  
  loadExisting(id) {
    return createEntityManager()
      .then(em => Promise.all(this.promisedQueries(em)))
      .then(values => {
        var queryResult = values[0];
        return {
          entity: queryResult.results[0],
          entityManager: queryResult.entityManager
        };
      });
  }

  createNew() {
    return createEntityManager()
      .then(em => {
        return {
          entity: em.createEntity(this.resourceName),
          entityManager: em
        };
      });
  }
}
