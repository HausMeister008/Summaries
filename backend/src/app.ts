import express from "express";
import { Pool } from "pg";
// https://node-postgres.com/
const app = express();
import jsonwebtoken from "jsonwebtoken";
import dotenv, { DotenvConfigOutput } from 'dotenv'
const dotenv_vars = dotenv.config()
const parsed = dotenv_vars.parsed
const ACCESS_TOKEN_SECRET: string|undefined = parsed ? parsed.ACCESS_TOKEN_SECRET : 'someothersecretidontneed'
const REFRESH_TOKEN_SECRET: string|undefined = parsed ? parsed.REFRESH_TOKEN_SECRET : 'somethinggweyelsethatisnotwrittttencrctly'
import hash_pwd, { compare_hash } from "./functions";


const pool = new Pool({
  host: 'localhost',
  user: 'leongrass',
  database: 'summaries',
  password: 'w1rch4tt3npr1v4t',
  port: 5432,
})

app.use(express.json())  // Hiermit kann Express JSON-Daten einlesen


app.get("/api/users", async (req, res) => {
  var { usernameStartsWith } = req.query
  usernameStartsWith = usernameStartsWith ?? ''
  var db_res = await pool.query(
    `select users.id as "UserID", users.username, users.firstname, users.lastname, samount, avatar
    from users, creator
    where
    users.id = creator.userID
    and (
      lower(firstname) like lower('${usernameStartsWith}%') 
      or lower(lastname) like lower('${usernameStartsWith}%')
      or lower(concat(firstname, ' ' , lastname)) like lower('${usernameStartsWith}%'))
    group by users.id, samount
    `
  )

  // var db_res = await pool.query('select * from "user";')
  var db_rows = db_res.rows
  var res_json: Array<Object> = []
  db_rows.forEach(row => {
    // console.log(row.mail)
    res_json.push({
      ID: row.UserID,
      name: row.firstname + ' ' + row.lastname,
      nSummaries: parseInt(row.samount),
      avatar: row.avatar ?? undefined
    })
  })
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
  res.json(userinfo)
})

app.post('/api/register', async (req, res) => {
  console.log(req.body)
  res.status(200)
})

app.get('/api/register/:username/:pwd/:firstname/:lastname', async (req, res) => {
  const pwd:string = req.params.pwd
  const username:string = req.params.username
  const firstname:string = req.params.firstname
  const lastname:string = req.params.lastname
  const pwd_hash = await hash_pwd(pwd)
  try{ 
    const result = await pool.query(`insert into users 
    (username, firstname, lastname, pwd) 
    values ('${username}', '${firstname}', '${lastname}', '${pwd_hash}')`)
    res.status(200)
  }catch(e){
    console.log(e)
    res.status(400)
  }
})

app.get('/api/login/:username/:pwd', async (req, res) => {
  const pwd:string = req.params.pwd
  const username:string = req.params.username
  const pwd_hash = await hash_pwd(pwd)
  if (!pwd_hash){
    res.send({success: false})
    return 
  }
  const res_users = await pool.query(`select pwd from users where username = '${username}'`)
  const user_exists = res_users.rows.length==1
  const right_pwd = user_exists?await compare_hash(res_users.rows[0].pwd, pwd):false
  const user_token = right_pwd?jsonwebtoken.sign({sub:username}, ACCESS_TOKEN_SECRET):''
  res.send({success: right_pwd, user_token})
})

const server = app.listen(8080, () => {
  console.log('opened server on', server.address());
})