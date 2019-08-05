const crypto=require("crypto");
const bcrypt=require("bcryptjs");
const nodemailer=require("nodemailer");
const sendgridTransport=require("nodemailer-sendgrid-transport");
const expValidator=require("express-validator/check");
const User=require("../models/user");
const path=require("path").join(__dirname,"../","routes","views","auth","login.ejs");
const path2=require("path").join(__dirname,"../","routes","views","auth","signup.ejs");
const path3=require("path").join(__dirname,"../","routes","views","auth","reset.ejs");
const path4=require("path").join(__dirname,"../","routes","views","auth","new-password.ejs");
const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}));
exports.getLogin=(req,res,next)=>{
    const errMessage=req.flash("error")[0];
    if(errMessage){
        console.log(req.query.edit);
    }
    console.log(req.flash("error"));
    res.render(path,{pageTitle:"Login",
    editing:false,
    isAuthenticated:req.session.isloggedin,
    csrfToken:req.csrfToken(),
    errorMessage:errMessage
});
};
exports.postLogin=(req,res,next)=>{
    
    const email=req.body.email;
    const password=req.body.password;
        User.findOne({email:email})
        .then(user=>{
            if(!user){
                req.flash("error","invalid email or password");
                return res.status(422).render(path,{pageTitle:"Login",
                editing:false,
                isAuthenticated:req.session.isloggedin,
                csrfToken:req.csrfToken(),
                errorMessage:req.flash("error")[0],
                email:email,
                password:password,
                er:"em"
            });
            }
            console.log(user);
            bcrypt.compare(password,user.password)
            .then(match=>{
                if(match){
                    req.session.isloggedin=true;
                req.session.user=user;
                return req.session.save(()=>{
                 res.redirect("/");
                    
                })
            }   req.flash("error","wrong password");
                return res.status(422).render(path,{pageTitle:"Login",
                editing:false,
                isAuthenticated:req.session.isloggedin,
                csrfToken:req.csrfToken(),
                errorMessage:req.flash("error")[0],
                email:email,
                password:password,
                er:"p"
            });
            })
            .catch(err=>{
                console.log(err)
                res.redirect("/login");
            })
         })
        .catch(err=>{
        res.redirect("/500");
        console.log(err)});
     
};
exports.postLogout=(req,res,next)=>{
     req.session.destroy(()=>{
     res.redirect("/");
     });
 };
 exports.signUp=(req,res,next)=>{
       res.render(path2,{csrfToken:req.csrfToken(),errorMessage:req.flash("error")[0]});
 };
    exports.postsignUp=(req,res,next)=>{
        const email=req.body.email;
        const password=req.body.password;
        const confirm_password=req.body.confirm_password;
        const errors=expValidator.validationResult(req);
        if(!errors.isEmpty()){
           // console.log(errors.array()[0]);
           if(errors.array()[0].msg==="Please enter valid email"){
            return res.status(422).render(path2,{csrfToken:req.csrfToken(),errorMessage:errors.array()[0].msg,
                email:email,
                password:password,
                confirm_password:confirm_password,
                er:"em"});
            }
            return res.status(422).render(path2,{csrfToken:req.csrfToken(),errorMessage:errors.array()[0].msg,
                email:email,
                password:password,
                confirm_password:confirm_password,
                er:"p"});

        }
        console.log(password);
        console.log(confirm_password);

        User.findOne({email:email})
        .then(userDoc=>{
            if(userDoc){
                req.flash("error","E-mail exists already please try different");
                return res.status(422).render(path2,{csrfToken:req.csrfToken(),
                    errorMessage:req.flash("error")[0],
                    email:email,
                    password:password,
                    confirm_password:confirm_password,
                    er:"em"});
            }else{
                if(confirm_password !== password)
                {
                    req.flash("error","confirm password is different");
                    return res.status(422).render(path2,{csrfToken:req.csrfToken(),
                        errorMessage:req.flash("error")[0],
                        email:email,
                        password:password,
                        confirm_password:confirm_password,
                        er:"cp"
                        });
                }
                return bcrypt.hash(password,12)
                .then(hashedPassword=>{
                    const user=new User({
                        email:email,
                        password:hashedPassword,
                        cart:[]
                    });
                    return user.save();
                })
                .then(result=>{
                    res.redirect("/login");
                    return transporter.sendMail({
                        to:email,
                        from:"thebigshotdevelopers.com",
                        subject:"Signup succeeded",
                        html:"<h1>You successfully signed up</h1>"
                    });
                })
                .catch(err=>{
        res.redirect("/500");
        console.log(err)});
            }
        })
        .catch(err=>{
        res.redirect("/500");
        console.log(err)});
};
exports.getReset=(req,res,next)=>{
res.render(path3,{
    csrfToken:req.csrfToken(),
    errorMessage:req.flash("error")[0]
})
};
exports.postReset=(req,res,next)=>{
    
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
            res.redirect("/reset");
        }
        const token=buffer.toString("hex");
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                req.flash("error","No account with that email found");
                return res.redirect("/reset");
            }
            user.resetToken=token;
            user.resetTokenExpiration=Date.now() + 3600000;
            return user.save();
        })
        .then(result=>{
            res.redirect("/");
            return transporter.sendMail({
                to:req.body.email,
                from:"shop@node-complete.com",
                subject:"Password Reset",
                html:`
                <p>You requested a password Reset</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a>to set a new password</p>`
            });
        })
        .catch(err=>{
        res.redirect("/500");
        console.log(err)});
    })
};
exports.getnewPassword=(req,res,next)=>{
    const token=req.params.token;
    User.findOne({resetToken:token})
    .then(user=>{

        if(Date.now()<user.resetTokenExpiration){
        return res.render(path4,{
            csrfToken:req.csrfToken(),
            errorMessage:req.flash("error")[0],
            email:user.email
        });
    }
    req.flash("error","Token expire");
    return res.redirect("/reset");
    })
    .catch(err=>{
        res.redirect("/500");
        console.log(err)});
    
};
exports.postnewPassword=(req,res,next)=>{
    const password=req.body.password;
    const email=req.body.email;
    return bcrypt.hash(password,12)
                .then(hashedPassword=>{
                    User.findOne({email:email})
                    .then(user=>{
                        user.password=hashedPassword;
                        return user.save();
                    })
                    .then(()=>{
                        res.redirect("/login");
                    })
                    .catch(err=>{
        res.redirect("/500");
        console.log(err)});
                    })
                    .catch(err=>{
        res.redirect("/500");
        console.log(err)});
                   
                
};