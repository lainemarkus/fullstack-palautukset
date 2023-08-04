const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('strictQuery', false)

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  name: {
    type: String,
  },
  passwordHash: {
    type: String,
  },
  blogs: [
    {
      default: [],
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],

})


userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash

  }
})

const User = mongoose.model('User', userSchema)


module.exports = User