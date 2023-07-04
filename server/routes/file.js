const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
router.post('/upload', validateToken, upload, (req, res) => {
    try{
    res.json({ filename: req.file.filename });
    }
    catch (error)
    {
        res.json(error);
        return;

    }

   
});
module.exports = router;