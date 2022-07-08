const router = require('express').Router();
const { Post, User, Comment } = require('../../models');

// Get all users posts and comments
router.get('/', (req,res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'content',
            'user_id'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id','comment_text','user_id','post_id'],
                include: {
                    model: User,
                    attributes:['username']
                }
            },
            {
                model: User,
                attributes:['username']
            }
        ]
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
  });

router.get('/:id',(req,res) => {

});

router.post('/', (req,res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
  });

router.put('/:id', withAuth, (req,res) => {

});

router.delete('/:id', withAuth, (req,res) => {

});


module.exports = routes;