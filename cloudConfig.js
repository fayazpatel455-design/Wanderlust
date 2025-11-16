require('dotenv').config();
const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');

// console.log("🌥️ ENV CHECK:", {
//   CLOUD_NAME: process.env.CLOUD_NAME,
//   CLOUD_API_KEY: process.env.CLOUD_API_KEY,
//   CLOUD_API_SECRET: process.env.CLOUD_API_SECRET ? "✅ Loaded" : "❌ Missing"
// });

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});
cloudinary.api.resources()
  .then(res => console.log("✅ Cloudinary working"))
  .catch(err => {
    console.log("❌ Error (full):", err);
  });




const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormates:['png','jpg','jpeg']
    // format: async (req, file) => 'png', // supports promises as well
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});

module.exports={
    cloudinary,storage,
};