let users = {}; // in-memory storage

function socketController(io) {
  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("updateLocation", (data) => {
      // Save latest location + role
      users[socket.id] = { ...data, id: socket.id };

      console.log("📍 Location update:", data);

      // Build visible list for THIS socket
      let visible;
      if (data.role === "driver") {
        visible = Object.values(users).filter(
          (u) => u.role === "passenger" || u.email === data.email
        );
      } else {
        visible = Object.values(users).filter(
          (u) => u.role === "driver" || u.email === data.email
        );
      }

      // Send only to THIS user
      socket.emit("locations", visible);

      // Also update everyone ELSE who cares about this user
      Object.entries(users).forEach(([id, u]) => {
        if (id === socket.id) return; // skip self
        const client = io.sockets.sockets.get(id);
        if (!client) return;

        let othersVisible;
        if (u.role === "driver") {
          othersVisible = Object.values(users).filter(
            (x) => x.role === "passenger" || x.email === u.email
          );
        } else {
          othersVisible = Object.values(users).filter(
            (x) => x.role === "driver" || x.email === u.email
          );
        }

        client.emit("locations", othersVisible);
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
      delete users[socket.id];

      // Update everyone else
      Object.entries(users).forEach(([id, u]) => {
        const client = io.sockets.sockets.get(id);
        if (!client) return;

        let visible;
        if (u.role === "driver") {
          visible = Object.values(users).filter(
            (x) => x.role === "passenger" || x.email === u.email
          );
        } else {
          visible = Object.values(users).filter(
            (x) => x.role === "driver" || x.email === u.email
          );
        }

        client.emit("locations", visible);
      });
    });
  });
}

module.exports = socketController;
