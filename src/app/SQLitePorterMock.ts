/*
  Implemented using edited code from actual cordova plugin
*/
export class SQLitePorterMock {
    /**
     * Trims leading and trailing whitespace from a string
     * @param {string} str - untrimmed string
     * @returns {string} trimmed string
     */


    trimWhitespace(str){
      return str.replace(/^\s+/,"").replace(/\s+$/,"");
    }

    importSqlToDb(db, sql, opts = {}){
      try {
        const statementRegEx = /(?!\s|;|$)(?:[^;"']*(?:"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*')?)*/g;
        var statements = sql
          .replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm,"") // strip out comments
          .match(statementRegEx);

        if(statements === null || (Array.isArray && !Array.isArray(statements))) statements = [];

        // Strip empty statements
        for(var i = 0; i < statements.length; i++){
          if(!statements[i]){
              delete statements[i];
          }
        }
        return db.sqlBatch(statements)
      } catch(e) {
        console.error(e.message);
      }
    }
}