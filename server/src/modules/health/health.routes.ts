import { Router } from 'express';
import { HttpStatus } from '../../constants/httpStatus.js';
import { SuccessMessages } from '../../constants/messages.js';
import { sendSuccessResponse } from '../../utils/response.js';

const router = Router();

router.get('/', (_req, res) => {
  sendSuccessResponse(res, HttpStatus.OK, SuccessMessages.HEALTH_OK, {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
