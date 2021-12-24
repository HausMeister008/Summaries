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
    sub?: string|JwtPayload,
    is_creator?: boolean
}
export function verify_access_token(token: string): Array<string|boolean|undefined|JwtPayload> {
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