import express from "express";
import { getGroups, syncGrpEp } from "../controller/groupController";
import { authenticate, authorize } from "../middleware/authenticate";

const groupRoutes = express.Router();

groupRoutes.get("/sync-group", syncGrpEp);

// groupRoutes.get("/:id", getgroup);

export default groupRoutes;
