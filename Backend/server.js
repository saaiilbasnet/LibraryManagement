// dotenv config
const {config} = require('dotenv');
config();

const app =  require('./src/app');

// importing connection.js

require('./src/database/connection');

function startServer(){

    const PORT = process.env.PORT;
    app.listen(PORT,()=>{
        console.log(`Server started at ${PORT}!`);
        
    })

}

startServer();