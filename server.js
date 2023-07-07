import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(error => console.error('MongoDB Atlas connection error:', error));

// Defining a schema for user data
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String
});

// TO define a model based on the schema
const User = mongoose.model('User', userSchema);

// Sign-up API functionality
app.post('/signup', (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Create a new user document with fields as per the requirements
  const newUser = new User({
    first_name,
    last_name,
    email,
    password
  });

  // Save the user to the database
  newUser.save()
    .then(() => res.send('User created successfully'))
    .catch(error => res.status(500).send('Error while creating user'));
});

// Sign-in API
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  //To check if user exists with the provided credentials
  User.findOne({ email, password })
    .then(user => {
      if (user) {
        res.send('Sign-in successful');
      } else {
        res.status(401).send('Invalid credentials');
      }
    })
    .catch(err => res.status(500).send('Error signing in'));
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
