import express, { query } from "express";
import { Pool } from "pg";
// https://node-postgres.com/
const app = express();
import jsonwebtoken from "jsonwebtoken";
import dotenv, { DotenvConfigOutput } from 'dotenv'
const dotenv_vars = dotenv.config()
const parsed = dotenv_vars.parsed
const ACCESS_TOKEN_SECRET: string | undefined = parsed ? parsed.ACCESS_TOKEN_SECRET : 'someothersecretidontneed'
const REFRESH_TOKEN_SECRET: string | undefined = parsed ? parsed.REFRESH_TOKEN_SECRET : 'somethinggweyelsethatisnotwrittttencrctly'
import * as functions from "./functions";


const pool = new Pool({
  host: 'localhost',
  user: 'leongrass',
  database: 'summaries',
  password: 'w1rch4tt3npr1v4t',
  port: 5432,
})

app.use(express.json())  // Hiermit kann Express JSON-Daten einlesen


app.get("/api/users", async (req, res) => {
  var token: string = (typeof (req.query.token) == 'string') ? req.query.token : ''
  var { usernameStartsWith } = req.query
  const verified_token = functions.verify_access_token(token)
  const sub = verified_token[0]
  const is_creator = verified_token[1]
  usernameStartsWith = usernameStartsWith ?? ''
  // only the creators with at least one summary uploaded
  var db_res = await pool.query(
    `select users.id as "UserID", username, firstname, lastname, avatar, count(summaries.id) as "nSummaries"
    from users, creator, summaries
    where
    users.id = creator.userID
    and users.username != '${sub}'
    and summaries.creator = creator.id
    and (
      lower(firstname) like lower('${usernameStartsWith}%') 
      or lower(lastname) like lower('${usernameStartsWith}%')
      or lower(concat(firstname, ' ' , lastname)) like lower('${usernameStartsWith}%'))
    group by users.id
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
      nSummaries: row.nSummaries,
      avatar: row.avatar ?? undefined
    })
  })
  console.log(res_json)
  res
    .status(200)
    .json(res_json);
});

app.get('/api/userdetails/:id/:token', async (req, res) => {
  const id = req.params.id
  const token: string = req.params.token
  const verified_token = functions.verify_access_token(token)
  const sub = verified_token[0]
  if (sub == '') {
    res.send({ success: false })
    return
  }
  const details = await pool.query(
    `select summaries.id, sumname, subject_name, subject_year, school_name, location_name,"Date", avg(rating) as "rating", count(rating) as "ratingamount"
    from users, creator, summaries, ratings, subjects, schools, locations
    where users.id = ${id}
    and users.id = creator.userID
    and creator.id = summaries.creator
    and ratings.ratedSummary = summaries.id
    and summaries.subject_id = subjects.id 
    and subjects.subject_school = schools.id 
    and schools.school_plz = locations.plz 
    group by summaries.id, subjects.subject_name, subjects.subject_year, schools.school_name,locations.location_name
    `
  )
  const userinfo = details.rows
  details.rows.forEach(row => {
    row.rating = parseFloat(row.rating).toFixed(2)
  })
  console.log(userinfo)
  res.json(userinfo)
})

interface queryRetVal {
  id: number
}

app.post('/api/register', async (req, res) => {
  const default_avatars = ['headphones_small.jpg','study.jpg', 'studying_with_laptop.jpg']
  const default_avatar = default_avatars[Math.floor(Math.random()*default_avatars.length)]
  const { username, pwd, firstname, lastname, creator_account } = req.body
  const hashed_pwd = await functions.hash_pwd(pwd)
  try {
    const user_exists = (await pool.query(`select * from users where username = '${username}'`)).rows.length > 0
    if (!user_exists) {
      const query_res: queryRetVal | any = await pool.query(
        `insert into users (username, firstname, lastname, pwd, avatar) 
      values ('${username}', '${firstname}', '${lastname}', '${hashed_pwd}', '${default_avatar}')
      returning *`
      )
      if (creator_account) {
        const qr = await pool.query(`insert into creator (userid) values (${query_res.rows[0].id})`)
      }
      res.send({ success: true })
    } else {
      console.log('user already existing')
      res.send({ success: false, user_exists: true })
    }
  } catch (e) {
    console.log(e)
    res.send({ success: false, user_exists: false })
  }
})

app.post('/api/login', async (req, res) => {
  const { pwd, username } = req.body
  const pwd_hash = await functions.hash_pwd(pwd)
  if (!pwd_hash) {
    res.send({ success: false })
    console.log('unauthorized authorization-attempt')
    return
  }
  const res_users = await pool.query(`select pwd from users where username = '${username}'`)
  const user_exists = res_users.rows.length == 1
  const res_creator = await pool.query(`select creator.id from users, creator where username = '${username}' and users.id = creator.userid`)
  const user_is_creator: boolean = res_creator.rows.length == 1
  const right_pwd = user_exists ? await functions.compare_hash(res_users.rows[0].pwd, pwd) : false
  const user_token = right_pwd ? functions.sign_access_token(username, user_is_creator) : ''
  res.send({ success: right_pwd, user_token })
  console.log(username, 'logged in')
})


app.post('/api/userprofile', async (req, res) => {
  const { token } = req.body
  const verified_token = functions.verify_access_token(token)
  const sub = verified_token[0]
  const is_creator = verified_token[1]

  const user_info_result = await pool.query(
    `select id, username, firstname, lastname, avatar
    from users
    where users.username = '${sub}'
    `
  )
  const user_info_data = user_info_result.rows.length > 0 ? user_info_result.rows[0] : {}
  if (is_creator) {
    const creator_info_result = await pool.query(
      `select avg(rating) as "avg_rating", count(summaries.id) as "nSummaries"
      from users, creator, ratings, summaries
      where users.username = '${sub}'
      and users.id = creator.userid 
      and creator.id = summaries.creator 
      and summaries.id = ratings.ratedSummary
      group by users.id, ratings.id, summaries.id
      `
    )
    const creator_info_data = (
      creator_info_result.rows.length > 0 ?
        creator_info_result.rows[0] :
        { avg_rating: null, nSummaries: 0 }
    )
    const ret_val = Object.assign(user_info_data, creator_info_data)
    console.log(ret_val)
    res.send(ret_val)
  } else {
    console.log(user_info_data)
    res.send(user_info_data)
  }
})

const port = 8080
const server = app.listen(port, () => {
  console.log('opened server on port', port);
})