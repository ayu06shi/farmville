const express = require('express');
const { auth, isFarmer } = require('../middlewares/auth');
const { askController, getMyQuestions, postUpvote, postDownvote, getQuesController, replyController } = require('../controllers/ForumController');
const router = express.Router()

router.post('/ask', auth, isFarmer, askController);
router.get('/my-questions', auth, isFarmer, getMyQuestions);
router.post('/upvote/:id', auth, isFarmer, postUpvote);
router.post('/downvote/:id', auth, isFarmer, postDownvote);
router.get('/questions', auth, isFarmer, getQuesController);
router.post('/answer/:id', auth, isFarmer, replyController);

module.exports = router;