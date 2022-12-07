const mongoose = require('mongoose');

const connectMongo = () => {
  try {
    mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo database is connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectMongo;
