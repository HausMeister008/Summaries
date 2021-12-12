import bcrypt from "bcrypt";
export default async function hash_pwd(pwd: string):Promise<any> {
    const salt_rounds: number = 10;
    try{
        const salt = await bcrypt.genSalt(salt_rounds)
        const pwd_hash = await bcrypt.hash(pwd, salt)
        return pwd_hash
    }catch(e){
        console.log(e)
        return false
    }
}
export async function compare_hash(hash:string, pwd:string):Promise<boolean> {
    const same = await bcrypt.compare(pwd, hash)
    return same
}