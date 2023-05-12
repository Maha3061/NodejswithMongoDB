//Requiring mongoose package
var mongoose=require("mongoose");

// Schema
var formSchema=new mongoose.Schema({
	Studentname : String,
    Course: String,
    Age:String,
	email : String
});

module.exports=mongoose.model("Form",formSchema);

