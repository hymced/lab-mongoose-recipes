const mongoose = require("mongoose");

mongoose.set('strictQuery', true); 
// DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. 
// Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. 
// Or use `mongoose.set('strictQuery', true);` to suppress this warning.
// example: { age: '25' } --> Mongoose would throw a CastError if strictQuery is set to true because the query condition's value doesn't match the schema's definition for the age field, which expects a number, it should be { age: 25 }

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require("./models/Recipe.model");
// Import of the data from './data.json'
const data = require("./data");

//const MONGODB_URI = "mongodb://localhost:27017/recipe-app";
const MONGODB_URI = "mongodb://127.0.0.1:27017/recipe-app";

// Connection to the database "recipe-app"
mongoose
	.connect(MONGODB_URI)
	.then((x) => {
		console.log(`Connected to the database: "${x.connection.name}"`);
		// Before adding any recipes to the database, let's remove all existing ones
		return Recipe.deleteMany();
	})
	.then(() => {
		return Recipe.create({
			title: "Hamburger",
			level: "Easy Peasy",
			ingredients: ["Bread", "Ham", "Cheese", "Lettuce", "Egg"],
			cuisine: "USA",
			dishType: "main_course",
			duration: 30,
			creator: "everyone"
		})
	})
	.then((recipeCreated) => {
		console.log("Recipe created: ", recipeCreated.title);
	})
	.then(() => {
		// Recipe.insertMany(data);
		return Recipe.insertMany(data); // return required, see why in StackBlitz > js - promise explanations 2
	})
	.then((value) => {
		// console.log("here1")
		// console.log(value)
		// console.log("here2")

		return Recipe.findOneAndUpdate(
			{ title: "Rigatoni alla Genovese" },
			{ duration: 100 },
			{ new: true }
		);
	})
	.then((recipeUpdated) => {
		if (recipeUpdated.duration === 100) {
			console.log("Duration updated sucessfully: ", recipeUpdated.duration);
		} else {
			console.log("Something went wrong...");
		}
		return Recipe.deleteOne({ title: "Carrot Cake" });
	})
	.then((valueDeleted) => {
		if (valueDeleted.deletedCount > 0) {
			return console.log("Carrot Cake successfully deleted");
		} else {
			return console.log("Something went wrong...");
		}
	})
	.then(() => {
		mongoose.connection.close();
	})
	.catch((error) => {
		console.error("Error somewhere along the promise chain starting from the connection to the database: ", error);
	});
