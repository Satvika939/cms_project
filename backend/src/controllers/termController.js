const db = require('../db');

exports.getTermsByProgram = async (req, res) => {
  try {
    const { programId } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM terms
      WHERE program_id = $1
      ORDER BY term_number ASC
      `,
      [programId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch terms' });
  }
};

exports.createTerm = async (req, res) => {
  try {
    console.log('PARAMS:', req.params);

    const { programId } = req.params;
    const { term_number, title } = req.body;

    const result = await db.query(
      `
      INSERT INTO terms (program_id, term_number, title)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [programId, term_number, title]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === '23505') {
      return res.status(400).json({
        error: 'Term number already exists for this program',
      });
    }

    res.status(500).json({ error: 'Failed to create term' });
  }
};

exports.getTermById = async (req, res) => {
  try {
    const { programId, termId } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM terms
      WHERE id = $1 AND program_id = $2
      `,
      [termId, programId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Term not found'
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching term:', error);
    res.status(500).json({
      error: 'Failed to fetch term'
    });
  }
};

exports.updateTerm = async (req, res) => {
  try {
    const { termId } = req.params;
    const { title, description, term_number } = req.body;

    const result = await db.query(
      `
      UPDATE terms
      SET
        title = $1,
        term_number = $2,
        updated_at = now()
      WHERE id = $3
      RETURNING *
      `,
      [title,term_number, termId]
    );
    // console.log("reached after query");

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Term not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update term error:", err);
    res.status(500).json({ error: "Failed to update term" });
  }
};

