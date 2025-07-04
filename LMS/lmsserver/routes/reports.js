const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
// const jwtAuth = require('../middleware/auth');
// router.use(jwtAuth);


/**
 * @swagger
 * /reports/:
 *   post:
 *     summary: Get a role by ID
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - id
 *             properties:
 *               type:
 *                 type: string
 *                 description: the type
 *               id:
 *                 type: integer
 *                 description: the id
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID student
 *                 name:
 *                   type: string
 *                   description: The name of the student
 *                 type:
 *                   type: string
 *                   description: The creation date of the role
 *                 test_score:
 *                   type: integer
 *                   description: The score
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'data not found'
 *       500:
 *         description: Server error
 */


router.post('/', async (req, res) => {
    const { id, type } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM combined_scores_view WHERE type = ? AND id = ?  ', [type, id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'data not found' });
        }
        // console.log(rows, "djfhdfijddfjdf -------------fdsfdskfdkfsdk")
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;