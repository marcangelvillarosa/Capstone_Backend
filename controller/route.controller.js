const db = require('../database'); // ✅ same as your driversignup.controller.js

const routeController = {
  // ✅ Fetch route by route_name
  getRouteByName: (req, res) => {
    const { routeName } = req.params;

    if (!routeName) {
      return res.status(400).json({ success: false, message: 'Route name is required' });
    }

    const sql = `
      SELECT id, route_name, coordinates
      FROM routes
      WHERE route_name = ?
    `;

    db.query(sql, [routeName], (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ success: false, message: 'Route not found' });
      }

      let coordinates = [];
      try {
        coordinates = JSON.parse(result[0].coordinates); // ✅ parse JSON string to array
      } catch (e) {
        console.error('Invalid coordinates format');
      }

      res.json({
        success: true,
        route: {
          id: result[0].id,
          route_name: result[0].route_name,
          coordinates: coordinates,
        },
      });
    });
  },
};

module.exports = routeController;
