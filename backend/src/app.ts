import express, { application, query } from "express";
import { Pool } from "pg";
// https://node-postgres.com/
const app = express();
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import dotenv, { DotenvConfigOutput } from 'dotenv'
const dotenv_vars = dotenv.config()
const parsed = dotenv_vars.parsed
const ACCESS_TOKEN_SECRET: string | undefined = parsed ? parsed.ACCESS_TOKEN_SECRET : 'someothersecretidontneed'
const REFRESH_TOKEN_SECRET: string | undefined = parsed ? parsed.REFRESH_TOKEN_SECRET : 'somethinggweyelsethatisnotwrittttencrctly'
import * as functions from "./functions";
import multyparty from 'multiparty'
import { nanoid } from 'nanoid'
import sharp from 'sharp'
import fs from 'fs'
import { addData } from "./functions";
import path from "path";
import mime from "mime"


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
  var { usernameStartsWith, onlycreators } = req.query
  const verified_token = functions.verify_access_token(token)
  const sub = verified_token[0]
  // const is_creator = verified_token[1]
  usernameStartsWith = usernameStartsWith ?? ''
  // only the creators with at least one summary uploaded
  var db_res = await pool.query(
    `select users.id as "UserID", username, firstname, lastname, avatar, count(summaries.id) as "nSummaries"
    from 
    users, creator
    left join summaries on (summaries.creator = creator.id)
    where
    (users.id = creator.userID or not $3) and
    users.username != $1
    and (
      lower(firstname) like lower($2||'%') 
      or lower(lastname) like lower($2||'%')
      or lower(concat(firstname, ' ' , lastname)) like lower($2||'%')
      )
    group by users.id
    `, [sub, usernameStartsWith, onlycreators]
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

app.get('/api/mysums', async (req, res) => {
  const token: string = (typeof (req.query.token) == 'string') ? req.query.token : ''
  var searched_sum = req.query.searched_sum
  searched_sum = searched_sum ?? ''
  const verified_token = functions.verify_access_token(token)
  const sub = verified_token[0]
  if (!sub || sub == '') {
    res.send({ success: false })
    return
  }
  const user_id = await functions.getUserID(sub.toString())
  if (await functions.isCreator(sub.toString())) {
    const sums = await pool.query(`
    select
      summaries.id,
      summaries.sumname,
      coalesce(avg(rating), 0) as "rating",
      coalesce(count(rating), 0) as "ratingamount",
      "Date" as "preProssessedDate",
      subjects.subject_name,
      subjects.subject_year,
      schools.school_name,
      locations.location_name
    from 
      users
      join creator on (creator.userid = users.id)
      left join summaries on(summaries.creator = creator.id)
      join subjects on(summaries.subject_id = subjects.id)
      left join ratings on(ratings.ratedSummary = summaries.id)
      left join schools on(subjects.subject_school = schools.id)
      left join locations on(schools.school_plz = locations.plz)
    where
      users.id = $1
      and (
        lower(sumname) like lower($2||'%')
        or lower(subject_name) like lower($2||'%')
        or lower(school_name) like lower($2||'%')
        )
    group by
      summaries.id, 
      subjects.subject_name, 
      subjects.subject_year, 
      schools.school_name,
      locations.location_name
    `, [user_id, searched_sum])
    sums.rows.forEach(row => {
      row.ratingamount = parseInt(row.ratingamount)
    })
    res.json(sums.rows)
  }
  else{
    res.json({success:false})
  }
})

app.get('/api/userdetails/:id/:token', async (req, res) => {
  const creator_id = req.params.id
  const token: string = req.params.token
  const verified_token = functions.verify_access_token(token)
  const sub = verified_token[0]
  if (!sub || sub == '') {
    res.send({ success: false })
    return
  }
  const user_id = await functions.getUserID(sub.toString())
  const details = await pool.query(`
    select 
      s.id,
      sumname, 
      subject_name,
      subject_year,
      school_name,
      location_name,
      "Date",
      coalesce(avg(rating), 0) as "rating",
      coalesce(count(rating), 0) as "ratingamount",
      (case when 
        (select 1 from saccess 
          where 
          (s.id=saccess.summary 
            and saccess.userid = $2)
          limit 1) = 1 or 
          (select restricted 
            from summaries 
            where summaries.id = s.id
            limit 1
            )=false 
          then TRUE else FALSE END
        ) as "saccess"
    from
      users
      join creator on (users.id = creator.userID)
      join summaries s on (creator.id = s.creator)
      left join ratings on (ratings.ratedSummary = s.id)
      join subjects on (s.subject_id = subjects.id )
      join schools on (subjects.subject_school = schools.id )
      join locations on (schools.school_plz = locations.plz )
    where users.id = $1
    group by s.id, subjects.subject_name, subjects.subject_year, schools.school_name,locations.location_name
    `, [creator_id, user_id]
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
  const default_avatars = [
    'headphones_small.jpg', 'study.jpg', 'studying_with_laptop.jpg', 'headphones_white.jpg'
  ]
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
      returning *`, [username, firstname, lastname, hashed_pwd, default_avatar]
      )
      if (creator_account) {
        const qr = await pool.query(
          `insert into creator (userid) values ($1)`
          , [query_res.rows[0].id])
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
    , [username])
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
  const is_creator: boolean = typeof (verified_token[1]) === 'boolean' ? verified_token[1] : false

  const creator_info_result = await functions.userProfileInfo(sub)

  const creator_info_data: UserDetails = (
    creator_info_result.length > 0 ?
      creator_info_result[0] :
      {
        id: 0,
        username: undefined,
        firstname: undefined,
        lastname: undefined,
        avatar: undefined,
        avg_rating: 0,
        nSummaries: 0,
        is_creator: false
      }
  )
  var ret_val = creator_info_data
  ret_val.is_creator = is_creator
  res.send(ret_val)

})

app.post('/api/SumValues/', async (req, res) => {
  const current_subject: number = typeof (req.body.subject) == 'number' ? req.body.subject : 0
  const current_school = req.body.school

  var subjects: Array<Object> = (await pool.query(`
  select subject_name, subjects.id
  from subjects, schools
  where lower(schools.school_name) like lower($1||'%')
  and schools.id = subjects.subject_school
  `, [current_school])).rows.map((row) => { return { name: row.subject_name, id: row.id } }).sort()

  var schools: Array<string> = (await pool.query(`
  select distinct(school_name) 
  from subjects, schools
  where (subjects.id = $1 or 0=$1)
  and schools.id = subjects.subject_school
  `, [current_subject])).rows.map((row) => { return row.school_name }).sort()

  res.send({
    subjects,
    schools
  })
})



app.post('/api/upload_sum', (req, res) => {
  console.log('uploading new sum')
  var add_data: addData = {
    token: '',
    filename: undefined,
    sum_name: undefined,
    subject: undefined,
    grant_access: undefined,
    addusers: undefined,
  }
  try {
    const form = new multyparty.Form()
    const responses: Array<Promise<{ error?: any, filename: string }>> = []
    var response_data: { success: boolean, files: string[] } = { success: false, files: [] }
    form.on('part', (part) => {
      if (!part.filename) {
        // console.log('part without filename:', part.name)
        return
      }
      const save_name = nanoid() + part.filename
      add_data.filename = save_name
      // const resizePipeline = sharp()
      // console.info('part headers', part.headers)
      const writer = fs.createWriteStream(`./Uploads/${save_name}`)
      return responses.push(
        new Promise((resolve, reject) => {
          part
            // .pipe(resizePipeline)
            .pipe(writer)
            .on('error', (error) => {
              console.log(error.message)
              reject({ filename: save_name, error: error })
            })
            .on('finish', () => {
              response_data.success = true
              response_data.files.push(save_name)
              // Only if all are done
              resolve({ filename: part.filename })
              console.log('finish')
            })
        })
      )
    })
    form.on('field', async (name, value) => {
      if (["subject", "school"].includes(name)) {
        add_data[name] = value as "subject" | "school"
      } else if ("sum_name_inpt" == name) {
        add_data.sum_name = value
      } else if ('usertoken' == name) {
        add_data.token = value
      } else if ('restrict' == name) {
        var val: boolean = value == 'true' ? true : false
        console.log('access', (val ? 'restricted:' : 'granted'))
        add_data.grant_access = typeof (val) == 'boolean' ? val : true
      } else if ('addusers' == name) {
        var adduser_array: number[] = (value.replaceAll('[', '').replaceAll(']', '').replaceAll(',', ' ').split(' ')).map((v: string) => { return parseInt(v) })
        console.log('users:', ...adduser_array)
        // var adduser_array = typeof (adduser_array) == 'object' ?adduser_array:[1]
        add_data.addusers = adduser_array
      }
    })
    form.on('progress', (received, total) => {
      // console.log('progress:', received / total)
    })
    form.on('close', () => {
      // aperantly not emmitted when only using form.parse without cb
      console.info('form was closed')
      functions.addNewSum(add_data)
      Promise.allSettled(responses).then(data => {
        res.status(200).json(response_data)
      })
        .catch(err => {
          console.log(err.message)
        })
    })

    form.parse(req)
  } catch (e) {
    console.log(e)
  }
})

app.get('/api/getsum/:token/:sumId', async (req, res) => {
  const sumId = typeof (req.params.sumId) == "string" ? parseInt(req.params.sumId) : 0
  const token: string = typeof (req.params.token) == "string" ? req.params.token : ''

  const token_content = functions.verify_access_token(token)
  const sub = token_content[0]
  if (sub) {
    const user: number = typeof (sub) == "string" ? await functions.getUserID(sub) : 0
    const access = user ? await functions.checkSumAccess(user, sumId) : false
    if (access) {

      const { filename, name } = await functions.getSumName(sumId)
      const filePath = path.join(__dirname, `../Uploads/${filename}`)

      res.sendFile(filePath)
    }
    else {
      res.json({ access: false })
    }
  }
  else {
    res.status(404).json({ access: false })
    return
  }

})

app.post('/api/ratesum', async (req, res) => {
  const { sum_id, token, rating } = req.body
  const verified_token = await functions.verify_access_token(token)
  const sub: number = await functions.getUserID((verified_token[0] as string))
  var access: boolean = await functions.checkSumAccess(sub, sum_id)
  if (!await functions.check_already_rated(sum_id, sub)) {
    if (access && [1, 2, 3, 4, 5].includes(rating)) {
      pool.query(`
      insert into ratings
      (ratedsummary, rating, rating_user) 
      values ($1, $2, $3)
      `, [sum_id, rating, sub])
      res.json({ success: true })
    } else {
      res.json({ success: false })
    }
  } else {
    res.json({ success: false })
  }
})

const port = 8080
const server = app.listen(port, () => {
  console.log('opened server on port', port);
})