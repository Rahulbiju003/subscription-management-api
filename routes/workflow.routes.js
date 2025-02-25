import router from 'express';
import { sendRemainders } from '../controllers/workflow.controller.js';

const workflowRoutes = router();

workflowRoutes.post('/subscription/remainder',sendRemainders);

export default workflowRoutes;