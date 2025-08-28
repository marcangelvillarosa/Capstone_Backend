// const db = require('../database');

// const loginController = {
//   login: (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: 'Email and password are required.' });
//     }

//     console.log("Received login request:", email, password);


//     const sql = 'SELECT * FROM commuters WHERE Email = ? AND Password = ?'; // ✅ correct table

//     db.query(sql, [email, password], (err, results) => {
//       if (err) {
//         console.error('SQL Error:', err); // helpful for debugging
//         return res.status(500).json({ success: false, message: 'Internal server error' });
//       }

//       if (results.length > 0) {
//         res.json({ success: true, user: results[0] });
//       } else {
//         res.json({ success: false, message: 'Invalid credentials' });
//       }
//     });
//   }
// };

// module.exports = loginController;

const db = require('../database');

const loginController = {
  login: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Determine which table to query
    const isDriver = email.endsWith('@driver.com');
    const table = isDriver ? 'drivers' : 'commuters';
    const sql = `SELECT * FROM ${table} WHERE Email = ? AND Password = ?`;

    db.query(sql, [email, password], (err, results) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (results.length > 0) {
        res.json({ success: true, user: results[0] });
      } else {
        res.json({ success: false, message: 'Invalid credentials' });
      }
    });
  }
};

module.exports = loginController;

