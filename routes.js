import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("hello user");
});
export default router;
