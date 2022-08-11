var Message = require("../database/models/message");
const { body, validationResult } = require("express-validator");
//bla
// Display list of all Messages
exports.message_list = (req, res, next) => {
  Message.find({})
    .sort({ timeStamp: 1 })
    .populate("author")
    .exec((err, list_messages) => {
      if (err) {
        return next(err);
      }
      res.render("index", {
        title: "NFT Gossip Board",
        message_list: list_messages,
        user: req.user,
      });
    });
};

// Show message field

exports.post_get = (req, res, next) => {
  res.render("messagepost", { title: "Post A Message", user: req.user });
};

// Send message to database

exports.post_post = [
  body("title", "A title is required").trim().isLength({ min: 3 }).escape(),
  body("message", "A message is required").trim().isLength({ min: 3 }).escape(),

  (req, res, next) => {
    // Extracts the validation Errors from a request.
    const errors = validationResult(req);

    var message = new Message({
      title: req.body.title,
      message: req.body.message,
      author: req.user._id,
      timeStamp: Date.now(),
    });

    if (!errors.isEmpty()) {
      res.render("messagepost", {
        title: "Post A Message",
        message: message,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      message.save((err) => {
        if (err) {
          return next(err);
        }
        // Message saved. Redirect
        res.redirect("/");
      });
    }
  },
];

exports.delete_get = (req, res, next) => {
  console.log("Message ID", req.params.id);
  Message.findByIdAndRemove(req.params.id, function deleteMessage(err) {
    if (err) {
      return next(err);
    }
    // Success
    req.session.user = req.user;
    res.redirect("/");
  });
};
