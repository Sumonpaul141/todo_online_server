var express = require("express");
const mongoose = require('mongoose');
var bodyParser 	= require("body-parser");
var app = express();
var Port =  process.env.Port || 5000;

mongoose.connect('mongodb+srv://mrpaul:random1234@cluster0.szffb.mongodb.net/todoDB?retryWrites=true&w=majority', { keepAlive: 1, useUnifiedTopology: true , useNewUrlParser: true }).then(() => console.log('MongoDB Atlas Connected...')) .catch(err => console.log(err));
// mongoose.connect('mongodb://localhost:27017/newdb', { keepAlive: 1, useUnifiedTopology: true , useNewUrlParser: true }).then(() => console.log('MongoDB Local Connected...')) .catch(err => console.log(err));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.engine('html', require('ejs').renderFile);

var userSchema = new mongoose.Schema({
	name: String,
    password : String,
    email : String,
});
var user = mongoose.model("user", userSchema);

var taskSchema = new mongoose.Schema({
	taskTitle: String,
    taskDescription : String,
    createdAt : Date,
    userId :{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
});
var task = mongoose.model("task", taskSchema);


var todoSchema = new mongoose.Schema({
	todoTitle: String,
    isDone : { type: Boolean, default: false },
    taskId :{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Task"
		},
});
var todo = mongoose.model("todo", todoSchema);



app.post("/user_reg", function(req, res){

	var Sname= req.body.name;
    var Semail= req.body.email;
    var Spassword = req.body.password;
    
    if(Semail == null || Semail.trim() == "" ){

        var obj = {
            "code" : "0",
            "massage" : "Invalid parameter"
        }

        res.send(obj);
        console.log("Invalid phone!!");
    }else{
        var newUser = {name: Sname, password: Spassword, email : Semail};
        user.findOne({ 'email': Semail }, function(err, users){
            if (err) {
                console.log(err);
            }else{
                if(users == null){
                    user.create(newUser, function(err, newlyUser){
                        if (err) {
                            console.log(err);
                        }else{
                            var obj = {
                                "code" : "1",
                                "massage" : "User Created",
                                "name" : newlyUser.name,
                                "email" : newlyUser.email,
                                "id" : newlyUser.id
                            }
                            res.send(obj); 
                            console.log("User created!!");
                        }
                
                    });
                }else if (users != null){
                    var obj = {
                        "code" : "2",
                        "massage" : "user already exists"
                    }   
                    res.send(obj);
                    console.log("User exists in the database");
                }
            }
        })
    }
});

app.post("/user_login", function(req, res){

    var Semail= req.body.email;
    var Spassword = req.body.password;
    
    if(Semail == null || Semail.trim() == "" ){

        var obj = {
            "code" : "0",
            "massage" : "Invalid parameter"
        }

        res.send(obj);
        console.log("Invalid parameter");
    }else{
        user.findOne({ 'email': Semail , "password" : Spassword}, function(err, users){
            if (err) {
                console.log(err);
            }else{
                if(users == null){
                    var obj = {
                        "code" : "0",
                        "massage" : "User Not exists",
                    }
                    res.send(obj); 
                    console.log("User Not exists");
                }else if (users != null){
                    var obj = {
                        "code" : "2",
                        "massage" : "User details",
                        "name" : users.name,
                        "email" : users.email,
                        "id" : users.id,
                    }   
                    res.send(obj);
                    console.log("User Details");
                }
            }
        })
    }
});


app.post("/all_task", function(req, res){

    var Suser = req.body.userId;
    
    if(Suser == null || Suser.trim() == ""){

        var obj = {
            "code" : "0",
            "massage" : "Invalid parameter"
        }
        res.send(obj);
        console.log("Invalid parameter");

    }else{
        task.find({"userId" : Suser}, function(err, newlyTask){
            if (err) {
                console.log(err);
            }else{
                var allTask = []
                for (let index = 0; index < newlyTask.length; index++) {
                    var obj = {
                        "title" : newlyTask[index].taskTitle,
                        "descreiption" : newlyTask[index].taskDescription,
                        "taskId" : newlyTask[index]._id
                    }
                    allTask.push(obj);
                }
                
                var response = {
                    "code" : "1",
                    "allTask" : allTask
                }

                res.send(response); 
                console.log("All task send");
            }
    
        });
    }
});


app.post("/add_task", function(req, res){

    var Stitle= req.body.taskTitle;
    var Sdesc = req.body.taskDescription;
    var Suser = req.body.userId;
    
    if(Stitle == null || Stitle.trim() == "" || Suser == null || Suser.trim() == ""){

        var obj = {
            "code" : "0",
            "massage" : "Invalid parameter"
        }
        res.send(obj);
        console.log("Invalid parameter");

    }else{

        var newTask = {taskTitle: Stitle, taskDescription: Sdesc, "createdAt" : Date.now() , userId : Suser};

        task.create(newTask, function(err, newlyTask){
            if (err) {
                console.log(err);
            }else{
                var obj = {
                    "code" : "1",
                    "massage" : "task Created",
                    "title" : newlyTask.taskTitle,
                    "descreiption" : newlyTask.taskDescription,
                    "userId" : newlyTask.userId
                }
                res.send(obj); 
                console.log("Task created!!");
            }
    
        });
    }
});

app.post("/add_todo", function(req, res){

    var Stitle= req.body.todoTitle;
    var StaskId = req.body.taskId;
    
    if(Stitle == null || Stitle.trim() == "" || StaskId == null || StaskId.trim() == ""){

        var obj = {
            "code" : "0",
            "massage" : "Invalid parameter"
        }
        res.send(obj);
        console.log("Invalid parameter");

    }else{

        var newTodo = {todoTitle: Stitle, taskId : StaskId};
        todo.create(newTodo, function(err, newlyTodo){
            if (err) {
                console.log(err);
            }else{
                var obj = {
                    "code" : "1",
                    "massage" : "todo Created",
                    "todoTitle" : newlyTodo.todoTitle,
                    "isDone" : newlyTodo.isDone,
                    "todoId" : newlyTodo._id
                }
                res.send(obj); 
                console.log("Todo created!!");
            }
    
        });
    }
});


app.post("/all_todo", function(req, res){

    var StaskId = req.body.taskId;
    
    if(StaskId == null || StaskId.trim() == ""){

        var obj = {
            "code" : "0",
            "massage" : "Invalid parameter"
        }
        res.send(obj);
        console.log("Invalid parameter");

    }else{
        todo.find({"taskId" : StaskId}, function(err, newlyTodos){
            if (err) {
                console.log(err);
            }else{
                var allTodo = []
                for (let index = 0; index < newlyTodos.length; index++) {
                    var obj = {
                        "todoTitle" : newlyTodos[index].todoTitle,
                        "isDone" : newlyTodos[index].isDone,
                        "todoId" : newlyTodos[index]._id
                    }
                    allTodo.push(obj);
                }
                
                var response = {
                    "code" : "1",
                    "allTodo" : allTodo
                }

                res.send(response); 
                console.log("All todos send");
            }
    
        }).sort({createdAt : -1});
    }
});



app.post("/check_todo", function(req, res){

    var StodoId = req.body.todoID;
    var SisDone = req.body.isDone;
    
    if(StodoId == null || StodoId.trim() == ""){

        var obj = {
            "code" : "0",
            "massage" : "Invalid parameter"
        }
        res.send(obj);
        console.log("Invalid parameter");

    }else{
        todo.updateOne({"_id" : StodoId},{ $set: { "isDone": SisDone }}, function(err, newlyTodo){
            if (err) {
                console.log(err);
            }else{
                res.send(newlyTodo); 
                console.log("Todo updated, status send");
            }
    
        });
    }
});

app.post("/delete_todo", function(req, res){

    var StodoId = req.body.todoID;
    
    if(StodoId == null || StodoId.trim() == ""){

        var obj = {
            "code" : "0",
            "massage" : "Invalid parameter"
        }
        res.send(obj);
        console.log("Invalid parameter");

    }else{
        todo.deleteOne({"_id" : StodoId}, function(err, newlyTodo){
            if (err) {
                console.log(err);
            }else{
                res.send(newlyTodo); 
                console.log("Todo deleted, status send");
            }
    
        });
    }
});


app.post("/delete_task", function(req, res){


    var StaskId = req.body.taskId;
    
    if(StaskId == null || StaskId.trim() == ""){

        var obj = {
            "code" : "0",
            "massage" : "Invalid parameter"
        }
        res.send(obj);
        console.log("Invalid parameter");

    }else{
        task.deleteOne({"_id" : StaskId}, function(err, newlyTodo){
            if (err) {
                console.log(err);
            }else{
                if(newlyTodo.ok == 1 && newlyTodo.deletedCount ==1){
                    todo.deleteMany({"taskId" : StaskId}, function(err, deleted){
                        if (err) { 
                            console.log(err);
                        }else{
                            console.log("Todo of that task deleted, Status send");
                        }
                
                    });
                }
                res.send(newlyTodo); 
                console.log("Task with all todo of that task deleted, Status send");
            }
    
        });
    }
});


app.post("/update_task", function(req, res){


    var StaskId = req.body.taskId;
    var StaskTitle = req.body.title;
    var StaskDescription = req.body.description;
    
    if(StaskId == null || StaskId.trim() == ""){

        var obj = {
            "code" : "0",
            "massage" : "Invalid parameter"
        }
        res.send(obj);
        console.log("Invalid parameter");

    }else{
        task.updateOne({"_id" : StaskId},{taskTitle : StaskTitle, taskDescription : StaskDescription} , function(err, newlyTodo){
            if (err) {
                console.log(err);
            }else{
                res.send(newlyTodo); 
                console.log("Task updated, Status send");
            }
    
        });
    }
});

app.post("/update_todo", function(req, res){


    var StodoId = req.body.todoId;
    var StodoTitle = req.body.todoTitle;
        
    if(StodoId == null || StodoId.trim() == ""){

        var obj = {
            "code" : "0",
            "massage" : "Invalid parameter"
        }
        res.send(obj);
        console.log("Invalid parameter");

    }else{
        todo.updateOne({"_id" : StodoId},{todoTitle : StodoTitle} , function(err, newlyTodo){
            if (err) {
                console.log(err);
            }else{
                res.send(newlyTodo); 
                console.log("Todo updated, Status send");
            }
    
        });
    }
});

app.get("/", function(req, res){
    res.render('index.html');
});


app.listen(Port,function(req, res){
    console.log("Your server is running on " + Port);
});