const path=require("path").join(__dirname,"../","routes","views","500.ejs")
exports.get500=(req,res,next)=>{
res.render(path,{
    pageTitle:"Error!",
    isAuthenticated:req.session.isloggedin
})
};