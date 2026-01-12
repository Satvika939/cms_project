const db = require('../db');

exports.getPrograms = async (req, res) => {
  try {
    // console.log("i am here");
    const { status, language, topic } = req.query;

    let query = `
      SELECT DISTINCT p.*
      FROM programs p
      LEFT JOIN program_topics pt ON pt.program_id = p.id
      LEFT JOIN topics t ON t.id = pt.topic_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND p.status = $${params.length}`;
    }

    if (language) {
      params.push(language);
      query += ` AND p.language_primary = $${params.length}`;
    }

    if (topic) {
      params.push(topic);
      query += ` AND t.name = $${params.length}`;
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await db.query(query, params);
    // console.log(result.rows);
    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({
      error: 'Failed to fetch programs'
    });
  }
};

exports.getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET program id:", id);

    const result = await db.query(
      "SELECT * FROM programs WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const {
      title,
      description,
      language_primary,
      languages_available,
    } = req.body;

    if (!title || !language_primary) {
      return res.status(400).json({
        error: 'title and language_primary are required'
      });
    }

    const result = await db.query(
      `
      INSERT INTO programs (title, description, language_primary, languages_available)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [title, description, language_primary, languages_available]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({
      error: 'Failed to create program'
    });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
      // console.log(id);

    const {
      title,
      description,
      language_primary,
      languages_available,
    } = req.body;

    // ✅ Validation
    if (!title || !language_primary) {
      return res.status(400).json({
        error: "title and language_primary are required",
      });
    }
      // console.log("programId"+programId);
    const result = await db.query(
      `
      UPDATE programs
      SET
        title = $1,
        description = $2,
        language_primary = $3,
        languages_available = $4,
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
      `,
      [
        title,
        description,
        language_primary,
        languages_available,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Program not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating program:", error);
    res.status(500).json({
      error: "Failed to update program",
    });
  }
};
