const express = require('express');
const router = express.Router();
// const Candidate = require("../models/candidateForm.model");
const CandidateController = require('../controllers/candidateForm.controller');
const authMiddleware = require('../middlewares/Auth');


router.post('/create-new-candidate', CandidateController.createNewCandidate);
router.get('/getAll-new-candidate', CandidateController.getAllNewCandidate);
router.get('/get-single-candidate/:id', CandidateController.getSingleCandidateDetails);
router.put('/update-new-candidate/:id', CandidateController.updateNewCandidate);
router.delete('/delete-single-candidate/:id', CandidateController.deleteSingleCandidate);




module.exports = router;
