const mongodb=require('mongodb')
const mongoURI = 'mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';

function user_login(email,password,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(500)
            res.send({'status':'failed','reason':'server error'})
            return
        }
        dbclient.db('test').collection('profilestore').find({'email':email}).toArray().then(data=>{
            if(data.length===0){
                res.status(400)
                res.send({'status':'failed','reason':'email not registered'})
            }
            else{
                if(data[0].password===password){
                    res.status(200)
                    res.send({'status':'passed','name':data[0].name,'email':data[0].email})
                }
                else{
                    res.status(400)
                    res.send({'status':'failed'})
                }
            }
        })
    })
}
function user_register(obj,res){
    console.log(obj)
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(500)
            res.send({'status':'failed','reason':'server error'})
            return
        }
        dbclient.db('test').collection('verified_user').insertOne(obj,(error,response)=>{
            if(error){
                res.status(500)
                res.send({'status':'failed','reason':'server error'})
                return
            }
            res.status(200)
            res.send({'status':'success','reason':'posted'})
            return
        })
    })
}
function user_authenticated(email,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(500)
            res.send({'status':'failed','reason':'server error'})
            return
        }
        dbclient.db('test').collection('verified_user').insertOne(obj,(error,response)=>{
            if(error){
                res.status(500)
                res.send({'status':'failed','reason':'server error'})
                return
            }
            res.status(200)
            res.send({'status':'success','reason':'posted'})
            return
        })
    })
}
module.exports.user_login =user_login
module.exports.user_register=user_register
module.exports.user_authenticated=user_authenticated