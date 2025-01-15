import multer from "multer";
const storage = multer.diskStorage({
    destination:(req, file, cb) => {
      cb(null, './public/temp') //this is the path where the file will be saved
    },
    filename:(req, file, cb) =>{ //the function part is controller which explains what all is to be done. and  './' is the route which tells where all things must take place
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //this is just for a random name of file and for now we are not considering it
    cb(null, `${Date.now()}-${file.originalname}`);
     //this is the name of the file given by user
     console.log("Files:", req.files);
     console.log("Body:", req.body);
    }
  })
 const upload = multer({ 
    storage,
})
const uploadMiddleWare = upload.fields([
    {
        name : "avatar" ,
        maxCount : 1
    } ,
    {
        name : "coverImage" ,
        maxCount : 1
    }
  ])


  export {uploadMiddleWare} ;
  //we are using disk storage
  // file is present inside file which is provided by multer. 