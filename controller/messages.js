const Message = require("../models/Message");

module.exports.renderNewForm = async (req, res) => {
  res.status(200).render("messages/newMessage");
};
module.exports.createMessage = async (req, res) => {
  try {
    const message = new Message({
      user: res.locals.currentUser._id,
      title: req.body.title,
      text: req.body.description,
    });
    const savedMessage = await message.save();
    req.flash("success", "You've sent a message!");
    res.status(200).redirect("/");
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    req.flash("success", "You've deleted a message!");
    res.status(200).redirect("/");
  } catch (err) {
    res.redirect("/");
  }
};
module.exports.showMessages = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .sort([["createdAt", "descending"]])
      .populate("user");
    res.status(200).render("messages/showMessages", {
      messages,
    });
  } catch (err) {
    res.redirect("/");
  }
};
