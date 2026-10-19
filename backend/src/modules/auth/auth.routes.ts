import { Router } from "express";

import {
    getMe,
    googleCallback,
    googleLogin,
    logout,
    logoutAll,
    refresh,
} from "./auth.controller.js";

import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();


router.get("/google", googleLogin);

router.get("/google/callback", googleCallback);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.post(
    "/logout-all",
    requireAuth,
    logoutAll,
);

router.get(
    "/me",
    requireAuth,
    getMe,
);

export default router;