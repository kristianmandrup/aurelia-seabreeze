import {createEntityManager} from './entity-manager-factory';
// import lookupQueries from './lookup-queries';
/**
* Manages the application's shared lookups.
* Eagerly loading the lookups because there are only two.
*/
export class Lookups { 
  constructor() {
    // this.lookupQueries = lookupQueries;
    this.queries = this.findQueries();
    this.queryNames = this.findQueryNames();
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
    return createEntityManager()
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
