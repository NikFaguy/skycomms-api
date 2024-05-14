const webToken= require('jsonwebtoken')

const User = require(`../models/userModel`)

const requireUser = async (req, res, next) =>{

    //Vérification de l'authentification
    const {authorization} = req.headers

    if (!authorization){
        return res.status(401).json({error:'Cet opération nécessite un token valide.'})
    }
    const token = authorization.split(' ')[1]

    try{
      const {_id}=  webToken.verify(token, process.env.WEB_TOKEN_KEY)
      req.user= await User.findOne({_id}).select('_id')
      next()

    }catch (error){
        console.log(error)
        res.status(401).json({error: 'Requête non autorisée.'})

    }

    
}

module.exports = requireUser