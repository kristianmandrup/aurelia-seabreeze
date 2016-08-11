import {createEntityManager} from './entity-manager-factory';
// import lookupQueries from './lookup-queries';
/**
* Manages the application's shared lookups.
* Eagerly loading the lookups because there are only two.
*/
export class Lookups { 
  constructor() {
    this.queries = this.findQueries();
    this.queryNames = this.findQueryNames();
  }

  get entityManager() {
    throw "entityManager() must return a breeze EntityManager";
    // return createEntityManager(settings);
  }

  get lookupQueries() {
    throw "lookupQueries() must return the list of lookup query objects";
    // return lookupQueries;
  } 


  get promisedQueries(em) {
    return this.queries.map(query => em.executeQuery(query));  
  }

  findQueries() {
    return this.lookupQueries.map(item => Object.values(item)[0]);
  }

  findQueryNames() {
    return this.lookupQueries.map(item => Object.keys(item)[0]);
  }

  load() {
    return this.entityManager
      .then(em => Promise.all(this.promisedQueries(em)))
      .then(queryResults => {
        for (let res, index of queryResults) {
          let key = this.queryNames[index];
          this.results = this.results || {};
          this.results[key] = queryResults[index].results;
        }        
      })
  }
}
