require('dotenv').config();
let mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let Person;

personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  favoriteFoods: [String]
});

Person = mongoose.model("Person", personSchema);


const createAndSavePerson = (done) => {
  karlMarx = Person({name: "Karl", age: 21, favoriteFoods: ["Chicken", "Beef", "Burger"] })
  
  karlMarx.save((err, data)=>{
    if(err){console.error(err);}
    
    done(null, data);
  })
};

var arrayOfPeople = [
  { name: "Thea", age: 22, favoriteFoods: ["Pizza", "Chocolate", "Sweets"] },
  { name: "Angelo", age: 40, favoriteFoods: ["Beer", "Meat", "Vegetables"] },
  { name: "Bryan", age: 60, favoriteFoods: ["Carrots", "Broccoli"] }
]

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data)=>{
    if(err){ console.error(err); }
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, data)=>{
    if(err){ console.error(err); }
    done(null, data);
  })
  done(null /*, data*/);
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, data)=>{
    if(err){ console.error(err); }
    done(null, data);
  })
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data)=>{
    if(err){ console.error(err); }
    done(null, data);
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, data)=>{
    if(err){console.error(err);}
    data.favoriteFoods.push(foodToAdd);
    
    data.save((err, updatedData)=>{
      if(err){console.error(err);}
      
      done(null, updatedData);
    })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, (err, data)=>{
    if(err){console.error(err);}
    done(null, data);
  })
};

const removeById = (personId, done) => {
    Person.findByIdAndRemove(personId, (err, data)=>{
        if(err){ console.error(err); }
        done(null, data);
    });
  
};

const removeManyPeople = (done) => {
    const nameToRemove = "Mary";
    
    Person.remove({name: nameToRemove}, (err, res)=>{
        if(err){ console.log(err); }
        done(null, res);
    })
};

const queryChain = (done) => {
    const foodToSearch = "burrito";

    Person.find({favoriteFoods: foodToSearch})
    .sort({name: 1})
    .limit(2)
    .select({age: 0})
    .exec((err, res) => {
        if(err){ console.log(err); }
        done(null, res);
});
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
