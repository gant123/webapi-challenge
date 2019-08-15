const express = require('express');
const db = require('../helpers/projectModel');
const router = express.Router();

/******************************************************************************
 *                            End Points                                      *
 ******************************************************************************/

// get all projects
router.get('/', (req, res) => {
  db.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({ err: 'Could not get projects' });
    });
});

/******************************************************************************
 *                            Get Project by Id                               *
 ******************************************************************************/
router.get('/:id', validateId, async (req, res) => {
  try {
    const project = await db.get(req.params.id);

    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the project'
    });
  }
});

/******************************************************************************
 *                            Add new project                                 *
 ******************************************************************************/
router.post('/', async (req, res) => {
  try {
    const project = await db.insert(req.body);
    res.status(201).json(project);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error adding the project'
    });
  }
});

/******************************************************************************
 *                            Update project                                  *
 ******************************************************************************/
router.put('/:id', validateId, async (req, res) => {
  try {
    const project = await db.update(req.params.id, req.body);
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'The project could not be found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error updating the project'
    });
  }
});

/******************************************************************************
 *                            Delete project                                  *
 ******************************************************************************/
router.delete('/:id', validateId, async (req, res) => {
  try {
    const count = await db.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: 'The project has been nuked' });
    } else {
      res.status(404).json({ message: 'The project could not be found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error removing the project'
    });
  }
});
/******************************************************************************
 *         add an endpoint that returns all the actions for a project         *
 ******************************************************************************/
//only id 1 has actions at the moment
router.get('/:id/actions', validateId, async (req, res) => {
  console.log(req.params.id);
  try {
    const actions = await db.getProjectActions(req.params.id);
    res.status(200).json(actions);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error getting the actions for the project'
    });
  }
});

/******************************************************************************
 *                            custom middleware                               *
 ******************************************************************************/
async function validateId(req, res, next) {
  try {
    const { id } = req.params;

    const post = await db.get(id);

    if (post) {
      req.post = post;
      next();
    } else {
      res.status(404).json({ message: 'ID is not found bud!' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = router;
