const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const UserModel = require("./models/user_schema");
const ExerciseModel = require("./models/exercise_schema");
const LogModel = require("./models/log_schema");

require("dotenv").config();
require("./db.config").connectDB();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Save new user
app.post("/api/users", (req, res) => {
  const user = new UserModel({
    username: req.body.username,
  });

  user
    .save()
    .then((exercise) => {
      res.json(exercise);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
});

// Get list of all users
app.get("/api/users", (req, res) => {
  UserModel.find()
    .then((all_user) => {
      res.json(all_user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
});

// app.post('/api/users/:id/exercises', (req, res) =>{
//     const id = req.params.id;

//     UserModel.findById(id)
//     .then(user =>{
//         let date_input;

//         if(req.body.date === undefined){
//             date_input = new Date();
//         }else{
//             date_input = new Date(req.body.date);
//         }

//         console.log(date_input.toDateString());
//     })
// })
// Save Exercise
app.post("/api/users/:id/exercises", (req, res) => {
  const id = req.params.id;

  UserModel.findById(id)
    .then((user) => {
      let date_input;

      if (req.body.date === undefined) {
        date_input = new Date(Date.now());
      } else {
        date_input = new Date(req.body.date);
      }

      const exercise_object = new ExerciseModel({
        user_id: user._id,
        username: user.username,
        description: req.body.description,
        duration: req.body.duration,
        date: date_input.toDateString(),
      });

      exercise_object
        .save()
        .then((new_exercise) => {
          LogModel.findById(new_exercise.user_id)
            .then((log) => {
              if (log === null) {
                let old_count = 0;

                const log_object = new LogModel({
                  _id: new_exercise.user_id,
                  username: new_exercise.username,
                  count: ++old_count,
                  log: [
                    {
                      description: new_exercise.description,
                      duration: new_exercise.duration,
                      date: new_exercise.date,
                    },
                  ],
                });

                log_object
                  .save()
                  .then((new_log) => {})
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      error: err.message,
                    });
                  });
              } else {
                ExerciseModel.find({ user_id: new_exercise.user_id })
                  .then((docs) => {
                    const log_arr = docs.map((exerciseObj) => {
                      return {
                        description: exerciseObj.description,
                        duration: exerciseObj.duration,
                        date: exerciseObj.date.toDateString(),
                      };
                    });

                    const new_count = log_arr.length;

                    LogModel.findByIdAndUpdate(new_exercise.user_id, {
                      count: new_count,
                      log: log_arr,
                    })
                      .then((updated_log) => {})
                      .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                          error: err.message,
                        });
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      error: err.message,
                    });
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err.message,
              });
            });

          res.json({
            _id: new_exercise.user_id,
            username: new_exercise.username,
            description: new_exercise.description,
            duration: new_exercise.duration,
            date: new Date(new_exercise.date).toDateString(),
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err.message,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
});

// Access all logs of specified user
// app.get("/api/users/:_id/logs", (req, res) => {
//     const id = req.params._id;
//     let { from, to, limit } = req.query;
//     LogModel.findById(id)
//     .then(log =>{
//         let transformed_log = log.log.map(item =>{
//             return {
//                 ...item.toObject(),
//                 date: new Date(item.date)
//             }
//         });

//         if(req.query.from && req.query.to) {
//             const fromDate = new Date(from);
//             transformed_log = transformed_log.filter(log => new Date(log.date) >= fromDate);

//             const toDate = new Date(to);
//             transformed_log = transformed_log.filter(log => new Date(log.date) <= toDate);
//         }

//         if(limit) {
//             const limitInt = parseInt(limit);
//             transformed_log = transformed_log.slice(0, limitInt);
//         }

//         transformed_log = transformed_log.map(item => ({
//             description: item.description,
//             duration: parseInt(item.duration),
//             date: item.date.toDateString()
//         }));

//         res.json({
//             username: log.username,
//             count: log.count,
//             _id: log._id,
//             log: transformed_log
//         });
//     })
//     .catch(err =>{
//         console.log(err);
//         res.status(500).json({
//             error: err.message
//         });
//     })
// });

app.get("/api/users/:_id/logs", (req, res) => {
  const id = req.params._id;
  let { from, to, limit } = req.query;
  UserModel.findById(id)
    .then((user) => {
      const user_id = req.params._id;
      ExerciseModel.find({ user_id })
        .then((log) => {
          if (from && to) {
            log = log.filter(
              (e) =>
                new Date(e.date) >= new Date(from) &&
                new Date(e.date) <= new Date(to)
            );
          }

          if (limit) {
            log = log.splice(0, limit);
          }

          log = log.map((e) => {
            return {
              description: e.description,
              duration: e.duration,
              date: new Date(e.date).toDateString(),
            };
          });

          res.json({
            username: user.username,
            count: log.length,
            _id: user._id,
            log: log,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err.message,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
