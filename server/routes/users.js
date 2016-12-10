import express from 'express';
import validateInput from '../shared/validations/signup';

let router = express.Router();

router.post('/', (req, res) => {
  // console.log(req.body);

  // Timeout for loading form button
  setTimeout(() => {
    // Validation
    const { errors, isValid } = validateInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }

  }, 2000);
});

export default router;
