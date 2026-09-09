import { Router, type IRouter } from "express";
import healthRouter from "./health";
import activationRouter from "./activation";

const router: IRouter = Router();

router.use(healthRouter);
router.use(activationRouter);

export default router;
