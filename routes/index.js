var express = require('express');
var router = express.Router();

//const { body, validationResult} = require('express-validator')

var message_controller = require('../controllers/messageController')
var author_controller = require('../controllers/authorController')

/* GET home page. */
router.get('/', message_controller.message_list);

/* GET Signup Page */
router.get('/sign-up', author_controller.signup_get);

router.post('/sign-up', author_controller.signup_post);

/* GET Log-in Page */

router.get('/log-in', author_controller.login_get);

router.post('/log-in', author_controller.login_post);

/* GET Log-out Page */

router.get('/log-out', author_controller.logout_get)

/* GET and POST Memberlog Page */

router.get('/memberlog', author_controller.memberlog_get)

router.post('/memberlog', author_controller.memberlog_post)

/* GET and POST Memberlog Page */

router.get('/adminlog', author_controller.adminlog_get)

router.post('/adminlog', author_controller.adminlog_post)

/* GET Post Message Page */

router.get('/post', message_controller.post_get)

/* POST Message */

router.post('/post', message_controller.post_post)

/* DELETE Message */

router.get('/delete-message/:id', message_controller.delete_get)


module.exports = router;
