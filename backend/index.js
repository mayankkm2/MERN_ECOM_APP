const express = require('express');
require('./db/config');
const User = require('./db/User');
const Product = require('./db/Product');

const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/register',async (req,res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result); 
    
});


app.post('/login',async (req, res) => {
    //console.log(req.body);
    if(req.body.password && req.body.email) { 
        let user = await User.findOne(req.body).select('-password');
    if(user) {
        //if we get user
          res.send(user);
       } else {//if no match found
       res.send({result:"No user found"}); 
       }

    } else {
        res.send({result:"enter both password and email"}); 
    }
    
   
})

//ADD PRODUCT API
 app.post('/add-product' , async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
 })

 //GET PRODUCT API FROM DATABASE
app.get('/products' , async (req, res) => {
    let products =await Product.find();
    if(products.length>0) {
        res.send(products);
    }else {
        res.send({result:"no products found"});
    }
  })

 //DELETE API
 app.delete('/product/:id', async (req, res) => { 
 
 const result =await Product.deleteOne({_id:req.params.id});
 res.send(result);
 }) 

//GET SINGLE PRODUCT API WHEN UPDATING
 app.get('/product/:id' , async (req, res) => {
  let result = await Product.findOne({_id: req.params.id});
  if(result){
    res.send(result)
  } else{
    res.send('no record found')
  }
});

//UPDATE API
app.put('/product/:id' , async (req,res) => {
 let result = await Product.updateOne(
    {_id: req.params.id},
    {$set: req.body}
    );
    res.send(result);
})

//SEARCH API
app.get('/search/:key', async (req,res) => {
 let result = await Product.find({
    "$or":[
        { name:{$regex: req.params.key}},
        { company:{$regex: req.params.key}},
        { category:{$regex: req.params.key}}
    ]
 })
 res.send(result);
})


app.listen(5000);

 