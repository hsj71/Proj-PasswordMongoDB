const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
