// controller/driverinfo.controller.js
const db = require('../database'); // ✅ same as your driversignup.controller.js

const driverInfoController = {
  // ✅ Fetch driver info by email
  getDriverByEmail: (req, res) => {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const sql = `
      SELECT DriverID, FName, LastName, Route, ImageUrl, Email
      FROM drivers
      WHERE Email = ?
    `;

    db.query(sql, [email], (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ success: false, message: 'Driver not found' });
      }

      res.json({
        success: true,
        driver: result[0],
      });
    });
  },
};

module.exports = driverInfoController;
