// const db = require('../database');
// const cloudinary = require('cloudinary').v2;
// const multer = require('../middleware/multer');
// const { Readable } = require('stream');

// cloudinary.config({
//   cloud_name: 'dabx61gn9',
//   api_key: '568778585574721',
//   api_secret: 'ZLWh362xBUdLRHkR_gfQ5RvOD7I',
// });

// const uploadToCloudinary = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder: 'TrackSakay/Drivers' },
//       (error, result) => {
//         if (result) resolve(result);
//         else reject(error);
//       }
//     );

//     const readable = new Readable();
//     readable._read = () => {};
//     readable.push(buffer);
//     readable.push(null);
//     readable.pipe(stream);
//   });
// };

// const driverSignupController = {
//   signupDriver: async (req, res) => {
//     const { FirstName, LastName, Route, Email, Password } = req.body;
//     const file = req.file;

//     if (!FirstName || !LastName || !Route || !Email || !Password || !file) {
//       return res.status(400).json({ success: false, message: 'All fields are required.' });
//     }

//     try {
//       const result = await uploadToCloudinary(file.buffer);
//       const imageUrl = result.secure_url;

//       const sql = `
//         INSERT INTO drivers (FName, LastName, Route, ImageUrl, Email, Password)
//         VALUES (?, ?, ?, ?, ?, ?)
//       `;
//       const values = [FirstName, LastName, Route, imageUrl, Email, Password];

//       db.query(sql, values, (err, result) => {
//         if (err) {
//           console.error('DB Error:', err);
//           return res.status(500).json({ success: false, message: 'Database error' });
//         }

//       const driverID = result.insertId;
      

//         res.json({
//           success: true,
//           message: 'Driver registered successfully',
//           driverID: result.insertId,
//         });
//       });
//     } catch (error) {
//       console.error('Cloudinary Error:', error);
//       res.status(500).json({ success: false, message: 'Image upload failed' });
//     }
//   },
// };

// module.exports = driverSignupController;

const db = require('../database');
const cloudinary = require('cloudinary').v2;
const multer = require('../middleware/multer');
const { Readable } = require('stream');
const QRCode = require('qrcode'); // Add this package

cloudinary.config({
  cloud_name: 'dabx61gn9',
  api_key: '568778585574721',
  api_secret: 'ZLWh362xBUdLRHkR_gfQ5RvOD7I',
});

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'TrackSakay/Drivers' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

const driverSignupController = {
  signupDriver: async (req, res) => {
    const { FirstName, LastName, Route, Email, Password } = req.body;
    const file = req.file;

    if (!FirstName || !LastName || !Route || !Email || !Password || !file) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
      // Upload driver image
      const result = await uploadToCloudinary(file.buffer);
      const imageUrl = result.secure_url;

      // Insert driver into database
      const sql = `
        INSERT INTO drivers (FName, LastName, Route, ImageUrl, Email, Password)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [FirstName, LastName, Route, imageUrl, Email, Password];

      db.query(sql, values, async (err, result) => {
        if (err) {
          console.error('DB Error:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        const driverID = result.insertId;
        
        try {
          // Generate QR codes
          const addQRData = JSON.stringify({ 
            driverID, 
            action: 'add',
            email: Email
          });
          
          const minusQRData = JSON.stringify({ 
            driverID, 
            action: 'minus',
            email: Email
          });
          
          // Generate QR code buffers
          const addQRBuffer = await QRCode.toBuffer(addQRData);
          const minusQRBuffer = await QRCode.toBuffer(minusQRData);
          
          // Upload QR codes to Cloudinary
          const [addQRResult, minusQRResult] = await Promise.all([
            uploadToCloudinary(addQRBuffer),
            uploadToCloudinary(minusQRBuffer)
          ]);
          
          // Update driver with QR code URLs
          const updateSql = `
            UPDATE drivers 
            SET qr_add = ?, qr_minus = ?, capacity = 0 
            WHERE driverID = ?
          `;
          
          db.query(updateSql, [addQRResult.secure_url, minusQRResult.secure_url, driverID], (updateErr) => {
            if (updateErr) {
              console.error('Error updating QR codes:', updateErr);
              return res.status(500).json({ 
                success: false, 
                message: 'Driver registered but QR codes failed to save' 
              });
            }
            
            res.json({
              success: true,
              message: 'Driver registered successfully',
              driverID: driverID,
            });
          });
        } catch (qrError) {
          console.error('QR Code Error:', qrError);
          res.status(500).json({ 
            success: false, 
            message: 'QR code generation failed' 
          });
        }
      });
    } catch (error) {
      console.error('Cloudinary Error:', error);
      res.status(500).json({ success: false, message: 'Image upload failed' });
    }
  },
};

module.exports = driverSignupController;
