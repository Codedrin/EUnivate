import express from 'express';
import { getMessages, sendMessage } from '../controllers/userChatMessageController.js';

const router = express.Router();

router.route('/')
  .get(getMessages)
  .post(sendMessage);

export default router;
