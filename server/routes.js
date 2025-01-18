const express = require('express');

const router = express.Router();
const authController = require('./controllers/controllerAuth');
const membershipController = require('./controllers/controllerMembership');
const verifyToken = require('./middleware/verifyToken'); 
const { upload, setUploadFolder } = require('./utils/uploads');

router.get('/csrf-token', (req, res) => {
    const csrfToken = req.csrfToken();
    console.log('Token untuk member:', csrfToken);
    res.cookie('XSRF-TOKEN', csrfToken);
    res.json({ csrfToken });
});


router.post('/signup',  setUploadFolder('users_photo'),upload.single('foto'), authController.signUp);

router.post('/signIn',  authController.signIn);

router.post('/logout', authController.logout);

router.get('/getMembership', verifyToken, membershipController.getMembership);
router.get('/singleMembership/:id', verifyToken, membershipController.getSingleMembership)
router.post('/postMembership', setUploadFolder('membership_photo'),upload.single('img'), verifyToken, membershipController.addMembership);
router.put('/updateMembership/:id', setUploadFolder('membership_photo'),upload.single('img'), verifyToken, membershipController.updateMembership )
router.delete('/deleteMembership/:id', verifyToken, membershipController.deleteMembership);





module.exports = router;