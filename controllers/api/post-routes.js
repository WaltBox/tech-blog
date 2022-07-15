const router = require('express').Router();
const { Post, User, Comment } = require('../../models');

// Get all users posts and comments
router.get('/', (req,res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'content',
            'user_id',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id','comment_text','user_id','post_id','created_at'],
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
    Post.findOne({
        where: {
            id:req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id','comment_text','post_id','user_id','created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No Post found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
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

router.put('/:id', (req,res) => {
    Post.update(
        {
            title:req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
     })
     .catch(err => {
        console.log(err);
        res.status(500).json(err);
     });
});

router.delete('/:id', (req,res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: 'NO post found with this id '});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;