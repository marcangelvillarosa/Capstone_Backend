// Add this to your backend
const updateCapacityController = {
  updateCapacity: async (req, res) => {
    const { driverID, action } = req.body;
    
    if (!driverID || !action) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    
    try {
      let updateSql = '';
      if (action === 'add') {
        updateSql = 'UPDATE drivers SET capacity = capacity + 1 WHERE driverID = ?';
      } else if (action === 'minus') {
        updateSql = 'UPDATE drivers SET capacity = capacity - 1 WHERE driverID = ?';
      } else {
        return res.status(400).json({ success: false, message: 'Invalid action' });
      }
      
      db.query(updateSql, [driverID], (err, result) => {
        if (err) {
          console.error('DB Error:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        res.json({
          success: true,
          message: `Capacity ${action === 'add' ? 'increased' : 'decreased'} successfully`,
        });
      });
    } catch (error) {
      console.error('Update capacity error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};

module.exports = updateCapacityController;