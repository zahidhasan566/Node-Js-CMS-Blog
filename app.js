const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path= require('path');
const hbs= require('express-handlebars');
const {selectOption} = require('./config/customFunctions');
const flash = require('connect-flash');
const session = require('express-session');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
/*configure Mongoose to connect MongoDb */
const Db= 'mongodb+srv://zahid:jahid143@cluster0.oxzqq.mongodb.net/cms?retryWrites=true&w=majority';
mongoose.connect(Db).then(()=>{
    console.log('connection successfully')
})
const paginate = require('handlebars-paginate');
/* configure express */
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname,'public')));
// app.use(fileUpload());
app.use(methodOverride('newMethod'))



/*  Flash and Session*/
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());




/* Set up view Engine To use Handlebars */
const handlebars = hbs.create({ extname: '.hbs',defaultLayout:'default',helpers: {select: selectOption}},);
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');


// app.engine('.hbs', hbs({defaultLayout: 'default', helpers: {select: selectOption}}));
// app.set('view engine' , '.hbs');
// app.set('view engine', 'pug');
// app.set('views','./views');

/* Routes */
// app.use('/',(req,res)=>{
//     res.render('default/index');
// });
const defaultRoutes = require ('./routes/defaultRoutes');
app.use('/',defaultRoutes);
const adminRoutes = require ('./routes/adminRoutes');
app.use('/admin', adminRoutes);
//app.use('/admin',)


app.listen(3000,()=>{
    console.log("server is running at port 3000")
})
