const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session= require('express-session');
const flash = require('connect-flash');
const path = require('path');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


const sessionOPtions = {
    secret:'mysupersecret',
    resave:false, 
    saveUninitialized:true
}
app.use(session(sessionOPtions));
app.use(flash());

app.get('/register',(req,res)=>{
    let {name='anono'}= req.query;
    req.session.name=name;
    req.flash('success','user registered successfully')
    res.redirect('/hello')
})

app.get('/hello',(req,res)=>{
    res.locals.messages= req.flash('success')
    res.render('page.ejs',{name:req.session.name})
})

// app.get('/reqcount',(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You count ${req.session.count} times`)
// })

// app.get('/test',(req,res)=>{
//     res.send('test successful')
// })

// app.use(cookieParser('secretcode'));
// app.get('/greet',(req,res)=>{
//     res.cookie('greet','hello',{signed:true});
//    res.send('done');
// })

// app.get('/verify',(req,res)=>{
//     console.log(req.signedCookies);
//     res.send('verfied')
// })

app.listen(3000,()=>{
    console.log("Server is listening to port 3000")
})
