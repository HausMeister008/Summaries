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
  // const is_creator = verified_token[1]
  usernameStartsWith = usernameStartsWith ?? ''
  // only the creators with at least one summary uploaded
  var db_res = await pool.query(
    `select users.id as "UserID", username, firstname, lastname, avatar, count(summaries.id) as "nSummaries"
    from users, creator, summaries
    where
    users.id = creator.userID
    and users.username != $1
    and summaries.creator = creator.id
    and (
      lower(firstname) like lower($2||'%') 
      or lower(lastname) like lower($2||'%')
      or lower(concat(firstname, ' ' , lastname)) like lower($2||'%')
      )
    group by users.id
    `, [sub, usernameStartsWith]
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
  const details = await pool.query(`
    select 
      summaries.id, 
      sumname,
      subject_name,
      subject_year,
      school_name,
      location_name,
      "Date",
      coalesce(avg(rating), 0) as "rating",
      coalesce(count(rating), 0) as "ratingamount"
    from
      users
      join creator on (users.id = creator.userID)
      join summaries on (creator.id = summaries.creator)
      left join ratings on (ratings.ratedSummary = summaries.id)
      join subjects on (summaries.subject_id = subjects.id )
      join schools on (subjects.subject_school = schools.id )
      join locations on (schools.school_plz = locations.plz )
    where users.id = $1
    group by summaries.id, subjects.subject_name, subjects.subject_year, schools.school_name,locations.location_name
    `, [id]
  )
  const userinfo = details.rows
  details.rows.forEach(row => {
    row.rating = parseFloat(row.rating).toFixed(2)
  })
  res.json(userinfo)
})

interface queryRetVal {
  id: number
}

app.post('/api/register', async (req, res) => {
  const default_avatars = ['headphones_small.jpg', 'study.jpg', 'studying_with_laptop.jpg']
  const default_avatar = default_avatars[Math.floor(Math.random() * default_avatars.length)]
  const { username, pwd, firstname, lastname, creator_account } = req.body
  const hashed_pwd = await functions.hash_pwd(pwd)
  try {
    const user_exists = (
      await pool.query(`select * from users where username = $1`, [username])
      ).rows.length > 0
    if (!user_exists) {
      const query_res: queryRetVal | any = await pool.query(
        `insert into users (username, firstname, lastname, pwd, avatar) 
      values ( $1,  $2,  $3,  $4,  $5)
      returning *`, [username,firstname,lastname,hashed_pwd,default_avatar]
      )
      if (creator_account) {
        const qr = await pool.query(
          `insert into creator (userid) values ($1)`
          ,[query_res.rows[0].id])
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
  const res_users = await pool.query(`select pwd from users where username = $1`, [username])
  const user_exists = res_users.rows.length == 1
  const res_creator = await pool.query(
    `select creator.id from users, creator where username = $1 and users.id = creator.userid`
    ,[username])
  const user_is_creator: boolean = res_creator.rows.length == 1
  const right_pwd = user_exists ? await functions.compare_hash(res_users.rows[0].pwd, pwd) : false
  const user_token = right_pwd ? functions.sign_access_token(username, user_is_creator) : ''
  res.send({ success: right_pwd, user_token })
  console.log(username, 'logged in')
})

interface UserDetails {
  id: number,
  username?: string,
  firstname?: string,
  lastname?: string,
  avatar?: string,
  avg_rating: number,
  nSummaries: number,
  is_creator: boolean
}

app.post('/api/userprofile', async (req, res) => {
  const { token } = req.body
  const verified_token = functions.verify_access_token(token)
  const sub = verified_token[0]
  const is_creator:boolean = typeof(verified_token[1]) === 'boolean'? verified_token[1]:false

  const creator_info_result = await functions.userProfileInfo(sub)

  const creator_info_data: UserDetails = (
    creator_info_result.length > 0 ?
      creator_info_result[0] :
      { id: 0, 
        username: undefined, 
        firstname: undefined, 
        lastname: undefined, 
        avatar: undefined, 
        avg_rating: 0, 
        nSummaries: 0, 
        is_creator: false }
  )
  var ret_val = creator_info_data
  ret_val.is_creator = is_creator
  res.send(ret_val)

})

app.post('/api/addSumValues/', async (req, res)=>{
  const current_subject:number = typeof(req.body.subject)=='number'?req.body.subject:0
  const current_school = req.body.school

  var subjects: Array<Object>= (await pool.query(`
  select subject_name, subjects.id
  from subjects, schools
  where lower(schools.school_name) like lower($1||'%')
  and schools.id = subjects.subject_school
  `, [current_school])).rows.map((row)=>{return {name: row.subject_name, id: row.id}}).sort()
  
  var schools: Array<string>= (await pool.query(`
  select distinct(school_name) 
  from subjects, schools
  where (subjects.id = $1 or 0=$1)
  and schools.id = subjects.subject_school
  `,[current_subject])).rows.map((row)=>{return row.school_name}).sort()
  
  res.send({
    subjects,
    schools
  })
})

const port = 8080
const server = app.listen(port, () => {
  console.log('opened server on port', port);
})