import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const utils={}
utils.Hash=async(password)=>{
    // Cifrar contraseña
    const salt = await bcryptjs.genSalt(10)
    const hash = await bcryptjs.hash(password, salt)
    //console.log(hash)
    return hash
  }

  utils.verifyPassword =(inputPassword,dbPassword)=>{
      return bcryptjs.compareSync(inputPassword, dbPassword)
      
  }

  utils.JWT=(objuser,secretKey,expiration)=>{
  const {id,email,nombre,apellido}=objuser
      //console.log({...objuser})
      return jwt.sign({id,email,nombre,apellido},secretKey,{expiresIn:expiration})
  }

  utils.verifyToken=(token,secretKey)=>{
    return jwt.verify(token,secretKey)

  }