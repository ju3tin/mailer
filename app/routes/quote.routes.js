module.exports = app => {
  const quotes = require("../controllers/quote.controller.js");

  var router = require("express").Router();

  // Create a new quote
  router.post("/", quotes.create);

  // Retrieve all quotes
  router.get("/", quotes.findAll);

  // Retrieve all published quotes
  router.get("/published", quotes.findAllPublished);

  // Retrieve a single quote with id
  router.get("/:id", quotes.findOne);

  // Update a quote with id
  router.put("/:id", quotes.update);

  // Delete a quote with id
  router.delete("/:id", quotes.delete);

  // Create a new quote
  router.delete("/", quotes.deleteAll);

  app.use("/api/quotes", router);
};
