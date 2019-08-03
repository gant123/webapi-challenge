const express = require('express');
const db = require('../helpers/actionModel');
const router = express.Router();

/******************************************************************************
 *                            Custom middleware                               *
 ******************************************************************************/

function projectIdCheck(req, res, next) {
  console.log(req.body);
  if (!req.body.project_id) {
    res.status(400).json({
      message: `There is no project ID for the action`
    });
  } else {
    next();
  }
}

/******************************************************************************
 *                            End Points                                      *
 ******************************************************************************/

// get all actions
router.get('/', (req, res) => {
  db.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({ err: 'Could not get actions' });
    });
});

// get action by ID
router.get('/:id', async (req, res) => {
  try {
    const action = await db.get(req.params.id);

    if (action) {
      res.status(200).json(action);
    } else {
      res.status(404).json({ message: 'Action not found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the action'
    });
  }
});

// add new action
router.post('/', projectIdCheck, async (req, res) => {
  try {
    const action = await db.insert(req.body);
    res.status(201).json(action);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error adding the action'
    });
  }
});

// update action
router.put('/:id', async (req, res) => {
  try {
    const action = await db.update(req.params.id, req.body);
    if (action) {
      res.status(200).json(action);
    } else {
      res.status(404).json({ message: 'The action could not be found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error updating the action'
    });
  }
});
//aaaaa
// delete an action
router.delete('/:id', async (req, res) => {
  try {
    const count = await db.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: 'The action has been nuked' });
    } else {
      res.status(404).json({ message: 'The action could not be found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error removing the action'
    });
  }
});

module.exports = router;
