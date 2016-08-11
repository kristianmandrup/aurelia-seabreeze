// import {createEntityManager} from '../entity-manager-factory';
// import queries from './service-queries';
import capitalize from 'lodash/capitalize';

export class EntityService {
  defaultPageSize = 20;

  constructor(entityName, {pageCount, pageSize}) {
    this.entityName = entityName;
    this.pageCount = pageCount; 
    this.pageSize = pageSize || this.defaultPageSize;
  }

  get entityManager() {
    throw "entityManager() must return a breeze EntityManager";
    // return createEntityManager(settings);
  }

  get calcPageCount(queryResult) {
    return Math.ceil(queryResult.inlineCount / this.pageSize)
  }

  getPage(pageIndex) {
    return this.entityManager
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
    throw "queries() must return the service queries for the entity";
    // return queries;
  }

  get entityQueries() {
    return this.queries[this.entityName];
  }

  promisedQueries(em) {
    return this.queries.one.map(query => em.executeQuery(query));
  }
  
  loadExisting(id) {
    return this.entityManager
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
    return this.entityManager
      .then(em => {
        return {
          entity: em.createEntity(this.resourceName),
          entityManager: em
        };
      });
  }
}
