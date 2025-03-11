const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const jwtAuth = require('../middleware/auth');

router.use(jwtAuth);

/**
 * @swagger
 * tags:
 *   name: Student Trainings
 *   description: CRUD operations for student trainings
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentTraining:
 *       type: object
 *       required:
 *         - training_id
 *         - student_ids
 *       properties:
 *         training_id:
 *           type: integer
 *           description: The ID of the training associated with the students
 *         student_ids:
 *           type: array
 *           items:
 *             type: integer
 *           description: Array of student IDs to associate with the training
 *       example:
 *         training_id: 1
 *         student_ids: [1, 2, 3]
 */

/**
 * @swagger
 * /student_trainings:
 *   post:
 *     summary: Create student trainings
 *     tags: [Student Trainings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentTraining'
 *     responses:
 *       201:
 *         description: Student trainings created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */

router.post('/', async (req, res) => {
    const { training_id, student_ids } = req.body;

    // Validate request body
    if (!training_id || !Array.isArray(student_ids) || student_ids.length === 0) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    try {
        // Prepare values array for bulk insert
        const values = student_ids.map(student_id => [student_id, training_id]);

        // Execute bulk insert
        await db.query('INSERT INTO student_trainings (student_id, training_id) VALUES ?', [values]);

        res.status(201).json({ message: 'Student trainings created successfully' });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/:cid/:tid', async (req, res) => {
    const { tid, cid } = req.params;
    console.log("hitting")
    try {
        const query = `
     SELECT 
    u.id AS user_id,
    u.username,
    u.company_id,
    st.training_id,
  CASE WHEN st.training_id IS NOT NULL THEN 'Check' ELSE 'Uncheck' END AS has_training_record 
  FROM
    users u
LEFT JOIN
    student_trainings st ON u.id = st.student_id AND st.training_id = ?
WHERE
    u.company_id = ?;`
        const [rows] = await db.query(query, [tid, cid]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Not Mapped' });
        }
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
