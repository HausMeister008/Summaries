import bcrypt from "bcrypt";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import dotenv, { DotenvConfigOutput } from 'dotenv'
const dotenv_vars = dotenv.config()
const parsed = dotenv_vars.parsed
const ACCESS_TOKEN_SECRET: string = parsed ? parsed.ACCESS_TOKEN_SECRET : 'someothersecretidontneed'
const REFRESH_TOKEN_SECRET: string = parsed ? parsed.REFRESH_TOKEN_SECRET : 'somethinggweyelsethatisnotwrittttencrctly'
import { Pool, QueryResult } from "pg";


const pool = new Pool({
    host: 'localhost',
    user: 'leongrass',
    database: 'summaries',
    password: 'w1rch4tt3npr1v4t',
    port: 5432,
})

export async function hash_pwd(pwd: string): Promise<any> {
    const salt_rounds: number = 10;
    try {
        const salt = await bcrypt.genSalt(salt_rounds)
        const pwd_hash = await bcrypt.hash(pwd, salt)
        return pwd_hash
    } catch (e) {
        console.log(e)
        return false
    }
}
export async function compare_hash(hash: string, pwd: string): Promise<boolean> {
    const same = await bcrypt.compare(pwd, hash)
    return same
}

export function sign_access_token(sub: string, is_creator: boolean = false) {
    return jsonwebtoken.sign({ sub: sub, is_creator: is_creator }, ACCESS_TOKEN_SECRET)
}

export function sign_refresh_token(sub: string, secret: string = '') {
    return jsonwebtoken.sign({ sub: sub, secret: secret }, REFRESH_TOKEN_SECRET)
}

interface VerifyedAccessToken {
    sub?: string | JwtPayload,
    is_creator?: boolean
}
export function verify_access_token(token: string): Array<string | boolean | undefined | JwtPayload> {
    try {
        const data: VerifyedAccessToken = jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET);
        const { sub, is_creator } = data
        return [sub, is_creator]
    } catch (e) {
        return ['', false]
    }
}


interface UserDetails {
    id: number,
    username: string,
    firstname: string,
    lastname: string,
    avatar: string,
    avg_rating: number,
    nSummaries: number,
    is_creator: boolean
}

export async function userProfileInfo(sub: string | any): Promise<UserDetails[]> {
    const res = await pool.query(`
    select 
      users.id,
      username,
      firstname,
      lastname,
      avatar, 
      coalesce(avg(rating), 0) as "avg_rating",
      coalesce(count(summaries.id), 0) as "nSummaries"
    from 
      users
      left join creator on (users.id = creator.userID)
      left join summaries on (summaries.creator = users.id)
      left join ratings on (ratings.ratedSummary = summaries.id)
      where users.username = $1
      group by users.id
    `, [sub])
    const result = res.rows
    return result
}

export async function getUserID(user: string): Promise<number> {
    var res = await pool.query('select id from users where username = $1', [user])
    return parseInt(res.rows.length == 1 ? res.rows[0].id : 0)
}

export async function getCreatorID(creator: string): Promise<number | undefined> {
    var retval = parseInt((await pool.query(`
    select creator.id 
    from users, creator 
    where username = $1
    and users.id = creator.userID
    `, [creator])).rows[0].id)
    return retval
}

export interface addData {
    filename: string | undefined,
    sum_name: string | undefined,
    subject: string | undefined,
    [school:string]: string | undefined,
    token: string
}
export async function addNewSum(add_data: addData) {
    var sub: string | undefined | JwtPayload | boolean | number = verify_access_token(add_data.token)
    var creator = await getCreatorID(sub[0])
    pool.query(`
    insert into summaries (creator, subject_id, sumname, sumfilename)
    values ($1, $2, $3, $4)
    `, [creator, add_data.subject, add_data.sum_name, add_data.filename])
}


export async function checkSumAccess(userID: number, sumID: number): Promise<boolean> {
    var res = await pool.query(`
        select 
        (case when 
            (select 1 from saccess 
              where summaries.id=saccess.summary 
              and saccess.userid = $1
              limit 1) = 1 then TRUE else FALSE END
            ) as "saccess"
        from summaries 
        where summaries.id = $2
    `, [userID, sumID])

    return res.rows.length == 1 ? res.rows[0].saccess : false
}

interface fileNames {
    name: string,
    filename: string
}

export async function getSumName(sumID: number): Promise<fileNames> {
    var res = await pool.query(`
        select 
        sumfilename, sumname
        from summaries 
        where id = $1
    `, [sumID])

    var name = res.rows.length == 1 ? res.rows[0].sumname : ''
    var filename = res.rows.length == 1 ? res.rows[0].sumfilename : ''
    return { name, filename }
}
