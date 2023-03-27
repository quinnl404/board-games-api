module.exports = getNonexistantEndpoint = (req, res) => {
  res.status(404).send({ msg: "Bad endpoint" });
};
