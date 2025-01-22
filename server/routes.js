const express = require('express');

const router = express.Router();
const authController = require('./controllers/controllerAuth');
const membershipController = require('./controllers/controllerMembership');
const userMembershipController = require('./controllers/controllerUserMembership');
const midtransService = require('./services/midtransService');
const verifyToken = require('./middleware/verifyToken'); 
const { upload, setUploadFolder } = require('./utils/uploads');
const contentController = require('./controllers/controllerContent.js');


router.get('/csrf-token', (req, res) => {
    const csrfToken = req.csrfToken();
    console.log('Token untuk member:', csrfToken);
    res.cookie('XSRF-TOKEN', csrfToken);
    res.json({ csrfToken });
});


router.post('/signup',  setUploadFolder('users_photo'),upload.single('foto'), authController.signUp);

router.post('/signIn',  authController.signIn);

router.post('/logout', authController.logout);

router.get('/getUserData', authController.getUserData);

router.get('/getMembership', verifyToken, membershipController.getMembership);
router.get('/singleMembership/:id', verifyToken, membershipController.getSingleMembership)
router.post('/postMembership', setUploadFolder('membership_photo'),upload.single('img'), verifyToken, membershipController.addMembership);
router.put('/updateMembership/:id', setUploadFolder('membership_photo'),upload.single('img'), verifyToken, membershipController.updateMembership )
router.delete('/deleteMembership/:id', verifyToken, membershipController.deleteMembership);

router.get('/membershipUser', verifyToken,userMembershipController.getMembershipsUser );



router.post('/membership/:id/add-content', setUploadFolder('content_images'), upload.array('images', 10), verifyToken, contentController.addContentToMembership);
router.get('/membership-content/:id', contentController.getContentForMembership);


router.delete('/delete-content/:id',contentController.deleteContent);

router.post('/transaction/createTransactionToken', verifyToken, midtransService.createTransactionToken);

router.get('/membership/:membershipId/content', userMembershipController.getMembershipContent);

module.exports = router;