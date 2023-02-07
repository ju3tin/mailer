module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      fullname: String,
      doornumber: String,
      roadname: String,
      email: String,
      postcode: String,
      town: String,
      kitchenstyle: String,
      parking: Boolean,
      projecttype: String,
      worktopstyle: String,
      pricerange: String,
      buildersname: String,
      options: Array,
      dontwantstatement: String,
      hearaboutus: String,
      kitchencolour: String,
      fittersrequired: Boolean,
      timescale: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Quote = mongoose.model("quote", schema);
  return Quote;
};
