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
  var db_res = await pool.query(
    `select users.id as "UserID", firstname, name, count(summaries.id) as "nSummaries", avatar, avg(ratings.rating) as "avgrating"
    from users, creator, summaries, ratings
    where
    users.id = creator.userID
    and creator.id = summaries.creator 
    and ratings.ratedSummary = summaries.id
    and (lower(firstname) like lower('${usernameStartsWith}%') or lower(name) like lower('${usernameStartsWith}%'))
    group by users.id
    order by "avgrating" DESC
    `
  )

  // var db_res = await pool.query('select * from "user";')
  var db_rows = db_res.rows
  var res_json: Array<Object> = []
  db_rows.forEach(row => {
    // console.log(row.mail)
    res_json.push({
      ID: row.UserID,
      name: row.firstname + " " + row.name,
      nSummaries: parseInt(row.nSummaries),
      avatar: row.avatar ?? undefined,
      rating: parseFloat(row.avgrating).toPrecision(2)
    })
  })
  console.log(res_json)
  res
    .status(200)
    .json(res_json);
});

app.get('/api/userdetails/:id', async (req, res) => {
  const id = req.params.id
  const details = await pool.query(
    `select sumname, "Subject", "Date", avg(rating) as "rating", count(rating) as "ratingamount"
    from users, creator, summaries, ratings 
    where users.id = ${id}
    and users.id = creator.userID
    and creator.id = summaries.Creator
    and ratings.ratedSummary = summaries.id
    group by summaries.id
    `
  )
  const userinfo = details.rows
  await details.rows.forEach(row=>{
    row.rating = parseFloat(row.rating).toFixed(2)
  })
  console.log(details.rows)
  res.json(userinfo)
})

const server = app.listen(8080, () => {
  console.log('opened server on', server.address());
})