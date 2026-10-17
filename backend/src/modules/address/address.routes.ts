
import { Router } from "express";

import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "./address.controller.js";

import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listAddresses);

router.post("/", createAddress);

router.patch("/:addressId", updateAddress);

router.delete("/:addressId", deleteAddress);

router.patch("/:addressId/default", setDefaultAddress);

export default router;
