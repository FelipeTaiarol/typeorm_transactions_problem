## Queries being executed between rollbackTransaction and release

```
npm install
```

```
./test.sh
```

See that some queries are executed after the transaction is rolled back:


```
query: INSERT INTO test.TEST ("TEST") VALUES ($1)  -- PARAMETERS: [0]
query: INSERT INTO test.TEST ("TEST") VALUES ($1)  -- PARAMETERS: [1]
query: INSERT INTO test.TEST ("TEST") VALUES ($1)  -- PARAMETERS: [2]
query: INSERT INTO test.TEST ("TEST") VALUES ($1)  -- PARAMETERS: [3]
query: INSERT INTO test.TEST ("TEST") VALUES ($1)  -- PARAMETERS: [4]
query: ROLLBACK
query: INSERT INTO test.TEST ("TEST") VALUES ($1)  -- PARAMETERS: [6]
query: INSERT INTO test.TEST ("TEST") VALUES ($1)  -- PARAMETERS: [7]
```

If you check the database you will see those rows were actually inserted.
