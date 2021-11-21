import express from "express";
import { Pool } from "pg";

// https://node-postgres.com/

const app = express();


const pool = new Pool({
  host: 'localhost',
  user: 'leongrass',
  database: 'summaries',
  password: 'w1rch4tt3npr1v4t',
  port: 5432,
})

app.get("/api/users", async (req, res) => {
  var { usernameStartsWith } = req.query
  usernameStartsWith = usernameStartsWith ?? ''
  console.log('usernameStartsWith', usernameStartsWith)
  var db_res = await pool.query(    `select * from "user" where lower(firstname) like lower('${usernameStartsWith}%') or lower(name) like lower('${usernameStartsWith}%')`)
  // var db_res = await pool.query('select * from "user";')
  var db_rows = db_res.rows
  var res_json:Array<Object> = []
  db_rows.forEach(row=>{
    res_json.push({
      name: row.firstname + " " + row.name,
      nSummaries: 0,
      avatar: row.avatar ?? undefined
    })
  })
  console.log(res_json)
  res
    .status(200)
    .json(res_json);
});

const server = app.listen(8080, () => {
  console.log('opened server on', server.address());
})