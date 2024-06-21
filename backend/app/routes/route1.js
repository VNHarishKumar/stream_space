import multer from 'multer';
import AWS from 'aws-sdk';
import fs from 'fs';
import { promisify } from 'util';

 AWS.config.update({
  accessKeyId: 'Give ur Access Key ID',
  secretAccessKey: 'Give ur Secret Key ID',
  region: 'Region like us-east-1' 
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });
const s3 = new AWS.S3();
// Promisify fs.unlink to use async/await
    const unlinkAsync = promisify(fs.unlink);
    


const route = (app) => {
  console.log("Inside route of Backend");
  
  app.get('/', async (req, res) => {
     res.status(200).send({ message: 'Working!!!'});
  })
   
   app.get('/upload', async (req, res) => {
  try {
    const params = {
      Bucket: 'vidupload01' // Replace with your bucket name
    };
    
    const data = await s3.listObjects(params).promise();
    const videos = data.Contents.map(item => ({
      key: item.Key,
      url: `Cloud front URLs/${item.Key}`      // Give the cloud front URL which u have created
    }));
    
    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving videos from S3 bucket');
  }
});
   
    app.post('/upload', upload.single('video'), async (req, res) => {
    try {
      const file = req.file;
      const fileStream = fs.createReadStream(file.path);

      const uploadParams = {
        Bucket: 'vidupload01', // Replace with your bucket name
        Key: file.originalname,
        Body: fileStream,
        ContentType: file.mimetype
      };

      const data = await s3.upload(uploadParams).promise();
      await unlinkAsync(file.path); // Delete the file from the local server after upload

      res.status(201).send({ message: 'File uploaded successfully', url: data.Location });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error uploading file');
    }
  });


    app.delete('/upload')
}

export default route;
