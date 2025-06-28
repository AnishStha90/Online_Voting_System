const mongoose = require('mongoose')
const express = require('express')

mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log("DATABASE CONNECTED SUCESSFULLY")
})
.catch(error => console.log(error))

