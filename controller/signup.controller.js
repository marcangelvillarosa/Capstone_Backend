const db = require('../database');

const signupController = {
  signupCommuter: (req, res) => {
    const { FName, Email, Password } = req.body;

    if (!FName || !Email || !Password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const sql = 'INSERT INTO commuters (FName, Email, Password) VALUES (?, ?, ?)';
    db.query(sql, [FName, Email, Password], (err, result) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }

      res.json({ success: true, message: 'Commuter registered', commuterID: result.insertId });
    });
  }
};

module.exports = signupController;
