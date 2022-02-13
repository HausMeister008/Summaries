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
    [school: string]: string | undefined,
    token: string,
    grant_access: boolean | undefined,
    addusers: number[] | undefined,
}
export async function addNewSum(add_data: addData) {
    var sub: string | undefined | JwtPayload | boolean | number = verify_access_token(add_data.token)
    var creator = await getCreatorID(sub[0])
    console.log('restrict access:', add_data.grant_access)
    var summary_id = (await pool.query(`
    insert into summaries (creator, subject_id, sumname, sumfilename, restricted)
    values ($1, $2, $3, $4, $5)
    returning id
    `, [creator, add_data.subject, add_data.sum_name, add_data.filename, add_data.grant_access])).rows[0].id
    console.log(summary_id, add_data.addusers)
    if (add_data.addusers?.[0]) {
        console.log('adding users whith access')
        add_data.addusers?.forEach(user => {
            try {
                pool.query(`
            insert into saccess 
            (summary, userid)
            values ($1, $2)
            `, [summary_id, user])
            } catch (e: any) {
                console.log(e.messagge)
                console.log(`Not able to add user with id ${user}`)
            }
        })
    }
}


export async function checkSumAccess(userID: number, sumID: number): Promise<boolean> {
    var res = await pool.query(`
        select 
        (case when 
            (select 1 from saccess 
              where s.id=saccess.summary 
              and saccess.userid = $1
              limit 1) = 1 or 
              (select restricted 
                from summaries 
                where summaries.id = s.id
                limit 1
                )=false 
                then TRUE else FALSE END
            ) as "saccess"
        from summaries s
        where s.id = $2
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


export async function add_access(sum_id: number, userid: number) {
    pool.query(`
    insert into saccess (summary, userid) values ($1, $2)
    `, [sum_id, userid])
}


export async function check_already_rated(sum_id: number, user_id: number): Promise<boolean> {
    var res = await pool.query(`
    select * from ratings 
    where ratedsummary = $1 
    and rating_user = $2
    `, [sum_id, user_id])

    var already_rated: boolean = res.rows.length >= 1
    console.log('already rated:', already_rated)
    return already_rated
}
