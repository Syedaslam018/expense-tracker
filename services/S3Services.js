const AWS = require('aws-sdk')
require('dotenv').config();


exports.uploadToS3 = (data, filename) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_SECRET_KEY= process.env.IAM_SECRET_KEY;

    let s3bucket = new  AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_SECRET_KEY
    })
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        }
        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, response) => {
                if(err){
                    console.log(err)
                    reject(err);
                }
                else{
                    //console.log('success', response);
                    resolve(response.Location);
                }
            })
        })
        
}