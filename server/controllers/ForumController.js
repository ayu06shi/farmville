const Question = require('../models/Question');
const Reply = require('../models/Reply');

const askController = async(req, res) => {
    const { question, description, tags } = req.body;

    if(!question || !description || !tags) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
    }

    if(!req.user || !req.user._id) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
    }

    try {
        const newQues = await Question.create({
            question,
            description,
            author: req.user._id,
            tags,
        });

        return res.status(201).json({
            success: true,
            message: "Question added successfully",
            newQues,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getQuesController = async(req, res) => {
    try {
        const questions = await Question.find({})
        .populate("replies")
        .populate({
            path: "replies",
            populate: {
                path: "author",
                model: "User",
            },
        })
        .populate("author")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            questions,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

const postUpvote = async(req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    console.log('Id: ', id)

    console.log("UserId: ", userId);

    try {
        const findQues = await Question.findById(id);

        if(!findQues) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        if(findQues.upvote.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You have already upvoted",
            });
        }

        if(findQues.downvote.includes(userId)) {
            const downvote = await findQues.updateOne({
                $pull: { downvote: userId },
            });

            return res.status(200).json({
                success: true,
                message: "Response updated successfully"
            });
        }

        const upvote = await findQues.updateOne({
            $push: { upvote: userId },
        });

        return res.status(200).json({
            upvote
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

const postDownvote = async(req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    console.log('Id: ', id)

    console.log("UserId: ", userId);

    try {
        const findQues = await Question.findById(id);

        if(!findQues) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        if(findQues.downvote.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You have already downvoted",
            });
        }

        if(findQues.upvote.includes(userId)) {
            const upvote = await findQues.updateOne({
                $pull: { upvote: userId },
            });

            return res.status(200).json({
                success: true,
                message: "Response updated successfully"
            });
        }

        const upvote = await findQues.updateOne({
            $push: { downvote: userId },
        });

        return res.status(200).json({
            downvote
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

const getMyQuestions = async (req, res) => {
    const userId = req.user._id;
    try {
      const replies = await Question.find({ author: userId })
        .populate("replies")
        .populate({
          path: "replies",
          populate: {
            path: "author",
            model: "User",
          },
        })
        .populate("author")
        .sort({
          createdAt: -1,
        });
      return res.status(200).json(replies);
    } catch (error) {
       return res.status(500).json({
        success: false,
        message: "Internal Server Error" 
       });
    }
  }

  const replyController = async(req, res) => {
    const { answer } = req.body;
    const { id } = req.params;

    try {
        const reply = await Reply.create({
            reply: answer,
            author: req.user._id,
        });

        const findQues = await Question.findById(id);

        console.log("find", findQues);

        const addReply = await findQues.updateOne({
            $push: { replies: reply._id },
        });

        return res.status(200).json({
            success: true,
            message: "Reply added successfully",
            reply
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error" 
           });
    }
  }

  module.exports = { askController, getQuesController, postDownvote, postUpvote, getMyQuestions, replyController };