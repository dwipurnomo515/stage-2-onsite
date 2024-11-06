import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dstunonnz',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// single image
const uploader = async (file: Express.Multer.File) => {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

    const uploadFile = await cloudinary.uploader.upload(dataURI, {
        folder: "DumbMerch"
    });

    return {
        url: uploadFile.secure_url
    };
}


// multiple images
// const uploaderImages = async (files: Express.Multer.File[]) => {
//     const urls: ProductImageDto[] = [];
//     await Promise.all(
//         files.map(async (file) => {
//             const b64 = Buffer.from(file.buffer).toString('base64');
//             const dataURI = 'data:' + file.mimetype + ';base64,' + b64
//             const uploadFile = await cloudinary.uploader.upload(dataURI, {
//                 folder: process.env.CLOUDINARY_FOLDER
//             });

//             urls.push({
//                 url: uploadFile.secure_url
//             })
//         })
//     )
//     return urls
// }


export default uploader;