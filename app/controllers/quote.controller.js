const db = require("../models");
const Quote = db.quotes;

// Create and Save a new Quote
exports.create = (req, res) => {
  // Validate request
  if (!req.body.fullname) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Quote
  const quote = new Quote({
    fullname: req.body.fullname,
    doornumber: req.body.doornumber,
    roadname: req.body.roadname,
    email: req.body.email,
    postcode: req.body.postcode,
    phonenumber: req.body.phonenumber,
    town: req.body.town,
    kitchenstyle: req.body.kitchenstyle,
    parking: req.body.parking,
    projecttype: req.body.projecttype,
    worktopstyle: req.body.worktopstyle,
    pricerange: req.body.pricerange,
    buildersname: req.body.buildersname,
    options: req.body.options,
    dontwantstatement: req.body.dontwantstatement,
    hearaboutus: req.body.hearaboutus,
    kitchencolour: req.body.kitchencolour,
    fittersrequired: req.body.fittersrequired,
    timescale: req.body.timescale
  });

  // Save Quote in the database
  quote
    .save(quote)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Quote."
      });
    });
};

// Retrieve all quotes from the database.
exports.findAll = (req, res) => {
  const fullname = req.query.fullname;
  var condition = fullname ? { fullname: { $regex: new RegExp(fullname), $options: "i" } } : {};

  Quote.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving quotes."
      });
    });
};

// Find a single Quote with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Quote.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Quote with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Quote with id=" + id });
    });
};

// Update a Quote by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Quote.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Quote with id=${id}. Maybe Quote was not found!`
        });
      } else res.send({ message: "Quote was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Quote with id=" + id
      });
    });
};

// Delete a Quote with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Quote.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Quote with id=${id}. Maybe Quote was not found!`
        });
      } else {
        res.send({
          message: "Quote was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Quote with id=" + id
      });
    });
};

// Delete all quotes from the database.
exports.deleteAll = (req, res) => {
  Quote.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} quotes were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all quotes."
      });
    });
};

// Find all published quotes
exports.findAllPublished = (req, res) => {
  Quote.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving quotes."
      });
    });
};
