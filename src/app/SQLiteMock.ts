import { SQLiteObject } from './SQLiteObject';


declare var SQL;

export class SQLiteMock {

  public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
    var db;
    var storeddb = localStorage.getItem("database");

    if(storeddb) {
      var arr = storeddb.split(',');
      db = new SQL.Database(arr);
    }
    else {
       db = new SQL.Database();
    }

    return new Promise((resolve,reject)=>{
      resolve(new SQLiteObject(db));
    });
  }
}