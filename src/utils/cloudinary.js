import {v2 as cloudinary} from 'cloudinary'; // giving temporary name to v2 as cloudinary
import exp from 'constants';
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs'; // file system module , when we have to manage file like change permission etc then we use it
// we usually link and unlink files when we delete or remove file

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log(process.env.CLOUDINARY_CLOUD_NAME); // Should output: chai-code1

// cloudinary.v2.uploader.upload('path of file', {
//     public_id: 'name of file'
// }, (error, result) => {console.log(result);});
//Uploads the file at localFilePath to Cloudinary.
//resource_type: "auto" allows Cloudinary to automatically detect the type of the file (image, video, etc.).
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath) //Once the file is uploaded successfully, it deletes the local file to save storage.
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}
export {uploadOnCloudinary}