const path=require("path").join(__dirname,"routes","views","error.ejs");
const path2=require("path");
const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const mongoose=require("mongoose");
const User=require("./models/user");
const session=require("express-session");
const csrf=require("csurf");
const flash=require("connect-flash");
const https=require("https");
const multer=require("multer");
const helmet=require("helmet");
const compression=require("compression");
const morgan=require("morgan");
const fs=require("fs");
const accessLogStream=fs.createWriteStream(
    require("path").join(__dirname,"access.log"),
    {flags:'a'}
    );

app.use(helmet());
app.use(compression());
app.use(morgan("combined",{stream:accessLogStream}));
const MongoDbStore=require("connect-mongodb-session")(session);
app.set("view engine","ejs");
app.set("views","views");
const MONGODB_Uri=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-vvcgd.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
const store=new MongoDbStore({
uri:MONGODB_Uri,
collection:"sessions"
});
// const privateKey=fs.readFileSync("server.Key");
// const certificate=fs.readFileSync("server.cert");
const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images");
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype ==="image/jpeg" || file.mimetype ==="image/jpg" || file.mimetype ==="image/png")
    cb(null,true);
    else
    cb(null,false);
};
const csrfProtection=csrf();
const adminRoutes=require("./routes/admin");
const shopRoutes=require("./routes/shop");
const shopController=require("./controllers/shop");  
const errorController=require("./controllers/error");
const authRoutes=require("./routes/auth");
// function reqListner(req,res){

// }
//we can use by passing http.createServer(reqListner)
//or by using advanced js functions such as
// app.use((req,res,next)=>{//it is middleware
//     console.log("I m in middleware");
//     next();//this allows to send request to another middleware in line
// });


 app.use(bodyParser.urlencoded({extended:false}));
 app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single("image"));
 app.use(express.static(path2.join(__dirname,"public")));
 app.use("/images",express.static(path2.join(__dirname,"images")));
 app.use
 (session({secret:"my secret" ,
  resave:false, 
  saveUninitialized: false,
  store:store
})
 );
 app.post("/checkout",shopController.postCheckout);
 app.use(csrfProtection);
 app.use(flash());
 app.use((req,res,next)=>{
     if(!req.session.user)
     {
         next();
     }
    else{User.findById(req.session.user._id)
    .then(user=>{
                req.user=user;
                next();
    })
    .catch(err=>console.log(err));
}
 
});
 app.use("/admin",adminRoutes);
app.use(shopRoutes)
app.use(authRoutes);
app.get("/500",errorController.get500);
 app.use((req,res,next)=>{
    res.status(404).render(path,{pageTitle:"Page not found"});
 });
// const server=http.createServer(app);//this hunction returns server

// //process.exit(); it basically hard exits the event loop and the serverlistner shuts down
// //so user will not be able to view data on web page that is responded by server
// //so we will not use this function
//  server.listen(3000);//passing port in listen method and it will listen server
//requests for infinite loops and provide responses
mongoose.connect(MONGODB_Uri,{ useNewUrlParser: true })
.then(()=>{
    User.findOne().then((user)=>{
        if(!user){
            const user=new User({
                name:"sam",
                email:"sam@gmail.com",
                cart:[]
            });
            user.save();
        }
       
    })
   
// https
// .createServer({key:privateKey,cert:certificate},app)
app.listen(process.env.PORT || 3000);
})
.catch(err=>console.log(err));