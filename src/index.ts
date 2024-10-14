const express = require('express');
import { PORT } from './constant'
const app=express()




app.listen(PORT,()=>{
    console.log(`Server running at port number ${PORT}`)
})