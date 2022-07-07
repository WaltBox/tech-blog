const router = require('express').Router();
const { User, Post } = require('../../models');

router.get('/',(req,res) => {
    User.findAll({

    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Get single user

router.get('/:id',(req,res) => {
    User.findOne({
        attributes:{ exclude: ['password']},
        where: {
            id: req.params.id
        },
        inlcude: [
            {
                model: Post,
                attributes:['title','body']
            },
            {
                model: Comment,
                attributes: ['body']
            }
        ]
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/',(req,res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        console.log(req.session);
          req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
        
            res.json(dbUserData);
          });
        })
});

// //Create a new user?
// router.post('/', async (req, res) => {
//     try {
//         const dbUserData = await User.create({
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password,
//         });

//         req.session.save(() => {
//             req.session.loggedIn = true;
//             req.session.username = dbUserData.username;
//             req.session.userId = dbUserData.id;
//             res.status(200).json(dbUserData);
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     }
// });

// router.get('/login', (req,res) => {
//     if(req.session.loggedIn) {
//         console.log('success')
//         return;
//     }
    
// })
module.exports = router;