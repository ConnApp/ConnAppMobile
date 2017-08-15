## Backlog of features to test

* Constructor
  * It function is Defined
  * It builds collection from array of Collections. Should match expected
  * It builds 'Default' Collection when no argument is provided. Should match expected
* Find
  * It Function is Defined
  * It Function returns a Promise
  * It Query result matches the expected result
    * Save a document and query it. Should match saved
    * Save a document and query it with sort. Should match saved
    * Save a document and query it with sort, limit. Should match saved
    * Save a document and query it with sort, limit, skip. Should match saved
* Insert
  * It Function is Defined
  * It function returns a promise
  * It not providing collection argument. Should save document to 'Default' collection
  * It not providing data argument. Should throw error
  * It Insert works correctly
    * Insert valid document. Query the document. Should match saved
    * Insert valid bulk documents. Query the documents. Should match saved
    * Insert invalid invalid document in bulk insert. Should not insert any documents, even the valid ones.
    * Should publish WAMP route to update remote. Data should match expected
* Update
  * It Function is Defined
  * It Function returns a Promise
  * It not providing query argument. Should return query error on error.list
  * It not providing data argument. Should return data error on error.list
  * It Update works correctly
    * Insert a document. Update the Document. Query the document. Should match updated
    * Insert a bulk documents. Update the Documents. Query the documents. Should match updated
    * Should publish WAMP route to update remote. Data should match expected
* Count
  * It Function is Defined
  * It Function returns a Promise
  * It count works correctly
    * Insert many documents. Should match count of documents
* Remove
  * It Function is Defined
  * It Function returns a Promise
  * It Remove works correctly
    * It query argument is not provided, should return error
    * Insert 3 document. Then Remove 2. Then Count. Should return 1
      * Should publish WAMP route to update remote. Data should match expected
