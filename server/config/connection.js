const mongoose = require('mongoose');

// change before deployment
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://brochbaltzer:poop101@social-network-api.vxzbip3.mongodb.net/googlebooks');
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

module.exports = mongoose.connection;