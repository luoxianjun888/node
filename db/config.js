const config={
    DEBUG:true,
    MYSQL:{
        host:'localhost',
        database:'mjht',
        username:'root',
        password:'root'
    }
};

if(process.env.NODE_ENV==='production'){
    config.MYSQL-{
        host:'localhost',
        database:'mjht',
        username:'root',
        password:'root'  
    }
}

module.exports=config;