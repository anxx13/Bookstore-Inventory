const express = require('express')
const app = express()
const bodyParser=require("body-parser")

//Mongo Connection
const MongoClient =require("mongodb").MongoClient
const url='mongodb://127.0.0.1:27017';
const dbName='Tshirt_Inventory';
let db
MongoClient.connect(url, (err,client) => {
        if(err) return console.log(err);
        db=client.db(dbName); 
        console.log(`Connected Database: ${url}`);
        console.log(`Database : ${dbName}`);
});

app.set('views', './views');
app.set('view engine', 'ejs')
//app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    db.collection('Stock').find().toArray( (err,result)=>{
    if(err) return console.log(err)
    res.render('home1.ejs',{data:result})
    })
})

//Add new Product
app.get('/create', (req, res) => {
    res.render('add1.ejs')
})
app.post('/AddData',(req,res)=>{
    db.collection('Stock').save(req.body,(err,result)=>{
        if(err) return console.log(err);
        res.redirect('/')
    })
})

app.get('/editconfirmation', (req, res) => {
    res.render('editconfirmation.ejs')
})

//Update Stock
app.get('/updatestock', (req, res) => {
    res.render('updatestock1.ejs')
})
var s
app.post('/updatestock',(req,res)=>{
    db.collection('Stock').find().toArray((err,result)=>{
        if(err) return console.log(err);
        for(var i=0;i<result.length;i++){
            if(result[i].pid==req.body.id){
                s=result[i].stock
                break
            }
        }
        db.collection('Stock').findOneAndUpdate({pid:req.body.id},{$set:{stock: (parseInt(s)+parseInt(req.body.stock)).toString()}},{sort : {_id:-1}},(err,result)=>{
            if(err) return res.send(err)
            console.log(req.body.id+'stock updated')
            res.redirect('/')
        })
    })
})

//Update Price
app.get('/updateprice', (req, res) => {
    res.render('updateprice1.ejs')
})
app.post('/updateprice',(req,res)=>{
    db.collection('Stock').findOneAndUpdate({pid:req.body.id},{$set:{price:req.body.price}},{sort : {_id:-1}},(err,result)=>{
        if(err) return res.send(err)
        console.log(req.body.id+' price updated')
        res.redirect('/')
    })
})

//Delete a product
app.get('/delete', (req, res) => {
    res.render('delete1.ejs')
})
app.post('/delete',(req,res)=>{
    db.collection('Stock').findOneAndDelete({pid:req.body.id},(err,result)=>{
        if(err) return console.log('id not found')
        res.redirect('/')
    })
})
app.listen(8000, () => {
    console.log('listening on 8000')});    
