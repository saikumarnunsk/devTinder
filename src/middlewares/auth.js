const adminAuth = (req, res, next)=>{
    console.log('yes this is admin check')
        const AuthToken = "XYZ"
    const isAuthorized = AuthToken === 'XYZ'
    if(isAuthorized){
        next()
    }else{
        res.status(401).send('Unauthorized request')
    }
}

const userAuth = (req, res, next)=>{
    console.log('use Auth checked')
        const AuthToken = "XYZ"
    const isAuthorized = AuthToken === 'XYZ'
    if(isAuthorized){
        next()
    }else{
        res.status(401).send('Unauthorized request')
    }
}

module.exports = {adminAuth, userAuth}