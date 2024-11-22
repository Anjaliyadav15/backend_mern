import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp') //this is the path where the file will be stored
    },
    filename: function (req, file, cb) { //the function part is controller which explains what all is to be done. and  './' is the route which tells where all things must take place
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //this is just for a random name of file and for now we are not considering it
      cb(null, file.originalname) //this is the name of the file given by user
    }
  })

export const upload = multer({ 
    storage,
})
  //we are using disk storage
  // file is present inside file which is provided by multer. 