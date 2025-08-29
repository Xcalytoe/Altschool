const fs = require("fs");

const getfile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject("Could not retrieve items");
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

const createFile = (data, filePath) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.stringify(data));
    });
  });
};
const getReqBody = (req) => {
  return new Promise((resolve, reject) => {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      try {
        const bodyBuffer = Buffer.concat(body).toString();
        const parsedBody = JSON.parse(bodyBuffer);
        resolve(parsedBody);
      } catch (err) {
        reject("Invalid request body");
      }
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
};

// CREATE Item
const createItem = (req, res, filePath) => {
  getReqBody(req)
    .then(async (body) => {
      const getItems = await getfile(filePath);

      const updatedDb = await createFile([...getItems, body], filePath);
      if (updatedDb) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Item Added Successfully",
            data: body,
          })
        );
      }
    })
    .catch((err) => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(err);
    });
};

// GET items
const getAllItems = (res, filePath) => {
  getfile(filePath)
    .then((items) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Items retrieved successfully",
          data: items,
        })
      );
    })
    .catch((err) => {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(err);
    });
};

// GET Single item
const getItem = (res, filePath, itemId) => {
  getfile(filePath)
    .then((items) => {
      const findItem = items.find((item) => item.id == itemId);
      if (!findItem) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Item not found!",
            data: null,
          })
        );
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Item retrieved successfully",
          data: findItem,
        })
      );
      return;
    })
    .catch((err) => {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(err);
    });
};

// UPDATE Item
const updateItem = (req, res, filePath, itemId) => {
  getReqBody(req)
    .then(async (body) => {
      const getItems = await getfile(filePath);
      const itemIndex = getItems.findIndex((item) => item.id == itemId);
      if (itemIndex < 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "ID not found!",
            data: null,
          })
        );
        return;
      }
      getItems[itemIndex] = { ...getItems[itemIndex], ...body };
      const updatedDb = await createFile(getItems, filePath);
      if (updatedDb) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Item updated successfully",
            data: { ...getItems[itemIndex], ...body },
          })
        );
      }
    })
    .catch((err) => {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(err);
    });
};

//  DELETE Item
const deleteItem = async (res, filePath, itemId) => {
  try {
    const getItems = await getfile(filePath);

    const foundItem = getItems.find((item) => item.id == itemId);
    if (!foundItem) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Item not found!",
          data: null,
        })
      );
      return;
    }
    //   Remove the item from the list
    const filteredItem = getItems.filter((item) => item.id !== foundItem.id);
    const updatedDb = await createFile(filteredItem, filePath);
    if (updatedDb) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Item deleted successfully",
          data: null,
        })
      );
    }
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: err,
        data: null,
      })
    );
  }
};

module.exports = {
  getItem,
  getAllItems,
  createItem,
  getReqBody,
  deleteItem,
  updateItem,
};

// [
//   {
//     "id": 1,
//     "name": "Wireless Mouse",
//     "price": 25.99,
//     "size": "s"
//   },
//   {
//     "id": 2,
//     "name": "Laptop Backpack",
//     "price": 49.5,
//     "size": "m"
//   },
//   {
//     "id": 3,
//     "name": "Office Desk",
//     "price": 199.99,
//     "size": "l"
//   },
//   {
//     "id": 4,
//     "name": "Bluetooth Headphones",
//     "price": 79.0,
//     "size": "m"
//   },
//   {
//     "id": 5,
//     "name": "Coffee Mug",
//     "price": 12.75,
//     "size": "s"
//   }
// ]
