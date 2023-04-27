import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  //TODO: password: { type: String, required: true },
  uuid: { type: String, required: true },
  easyTime: { type: Number, required: true },
  mediumTime: { type: Number, required: true },
  hardTime: { type: Number, required: true },
});

export default mongoose.model('user', userSchema);