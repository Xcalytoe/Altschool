const http = require("http");
const path = require("path");
const url = require("url");
const {
  getItem,
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} = require("./utils/helperFns");

const HOSTNAME = "localhost";
const PORT = 4000;
const itemsFilePath = path.join(__dirname, "db", "items.json");

const reqHandler = (req, res) => {
  const method = req.method;
  const route = url.parse(req.url, true);
  const pathname = route.pathname;

  //   For GET requests
  if (method === "GET") {
    // Get all items
    if (pathname === "/items") {
      getAllItems(res, itemsFilePath);
      return;
    }
    // Get single item
    if (pathname.match(/^\/items\/\d+$/)) {
      const itemId = pathname.split("/")[2];

      getItem(res, itemsFilePath, itemId);
      return;
    }
  }
  //   POST
  if (method === "POST" && pathname === "/item") {
    createItem(req, res, itemsFilePath);
    return;
  }
  // UPDATE
  if (method === "PATCH" && pathname.match(/^\/items\/\d+$/)) {
    const itemId = pathname.split("/")[2];
    updateItem(req, res, itemsFilePath, itemId);
    return;
  }
  // DELETE
  if (method === "DELETE" && pathname.match(/^\/items\/\d+$/)) {
    const itemId = pathname.split("/")[2];
    deleteItem(res, itemsFilePath, itemId);
    return;
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found!" }));
};

const server = http.createServer(reqHandler);

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server started successfully on: http://${HOSTNAME}:${PORT}`);
});
