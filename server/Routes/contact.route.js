import express from "express";

// Controllers
import { sendEmailToAdmin } from "../Controllers/contact.controller.js";

const router = express.Router();

router.post("/contact-admin", sendEmailToAdmin);

export default router;
