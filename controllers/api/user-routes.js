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
                attributes:['id','title','contents','user_id','created_at']
            },
            {
                model: Comment,
                attributes: ['id','comment_text','created_at'],
                include: {
                    model: Post,
                    attributes:['title']
                }
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

router.post('/', (req,res) => {
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

router.post('/login', (req,res)=> {
    console.log('I am in login');
    User.findOne({
        where:{
            email: req.body.email
        }
    }).then(dbUserData => {
        if(!dbUserData){
            res.status(400).json({message: 'No user with that email address'});
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect Password!'});
            return;
        }
        console.log(req.session);
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;

            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are logged in!'});
            console.log(req.session);
        });
    });
});

router.post('/logout', (req,res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
})


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