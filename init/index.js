const Listing = require("../model/listing.js");
const mongoose = require("mongoose");

const initData = require("./data.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(mongo_url);
}
main()
  .then((res) => console.log("connetion was done successfully"))
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  //it will take the entire data from data.js and it will join with owner;
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner:'69178230dacaa22ffc15fe24',
  }));
  await Listing.insertMany(initData.data);
  console.log("data was successfully inserted");
};

initDB();
