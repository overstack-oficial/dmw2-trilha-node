const mongoose = require('mongoose');

const URI = "mongodb://localhost/overzap";
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}

mongoose.connect(URI, OPTIONS)
.then(() => { console.log("DB is UP") })
.catch((err) => { console.log(err)})