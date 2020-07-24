import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'my-dominos';
const FILE_PERMISSION = 'public-read'

export interface S3_File {
    ETag: string,
    Location: string,
    key: string,
    Key: string,
    Bucket: string,
}
export default class AmazoneService {

 
    
    public uploadFile(file: any) {
        
        const S3 = new AWS.S3({
            accessKeyId: process.env.AWS_ID,
            secretAccessKey: process.env.AWS_SECRET
        });
        const params = {
            Bucket: BUCKET_NAME,
            Key: file.originalname, // File name you want to save as in S3
            Body: file.buffer,
            ACL: FILE_PERMISSION
        };
        return new Promise((resolve, reject) => {
            S3.upload(params, (err, data: S3_File) => {
                resolve(data); reject(err);
            });
        })
    };
};