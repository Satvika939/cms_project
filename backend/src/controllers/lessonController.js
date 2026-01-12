const db = require('../db');

/**
 * List lessons under a term
 */
exports.getLessonsByTerm = async (req, res) => {
  try {
    const { termId } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM lessons
      WHERE term_id = $1
      ORDER BY lesson_number ASC
      `,
      [termId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};

/**
 * Create lesson (always starts as draft)
 */
exports.createLesson = async (req, res) => {
  try {
    const { termId } = req.params;
    const {
      lesson_number,
      title,
      content_type,
      duration_ms,
      is_paid,
      content_language_primary,
      content_languages_available,
      content_urls_by_language,
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO lessons (
        term_id,
        lesson_number,
        title,
        content_type,
        duration_ms,
        is_paid,
        content_language_primary,
        content_languages_available,
        content_urls_by_language,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'draft')
      RETURNING *
      `,
      [
        termId,
        lesson_number,
        title,
        content_type,
        duration_ms,
        is_paid ?? false,
        content_language_primary,
        content_languages_available,
        content_urls_by_language,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === '23505') {
      return res.status(400).json({
        error: 'Lesson number already exists in this term',
      });
    }

    res.status(500).json({ error: 'Failed to create lesson' });
  }
};

exports.scheduleLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { publish_at } = req.body;

    if (!publish_at) {
      return res.status(400).json({ error: 'publish_at is required' });
    }

    const result = await db.query(
      `
      UPDATE lessons
      SET status = 'scheduled',
          publish_at = $1,
          updated_at = now()
      WHERE id = $2
        AND status = 'draft'
      RETURNING *
      `,
      [publish_at, lessonId]
    );


    // only draft lessons can be scheduled
    if (!result.rows.length) {
      return res.status(400).json({
        error: 'Only draft lessons can be scheduled'
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to schedule lesson' });
  }
};

exports.publishLesson = async (req, res) => {
  const client = db;

  try {
    const { lessonId } = req.params;

    await client.query('BEGIN');

    // 1️⃣ Publish lesson
    const lessonRes = await client.query(
      `
      UPDATE lessons
      SET status = 'published',
          published_at = now(),
          updated_at = now()
      WHERE id = $1
        AND status IN ('draft', 'scheduled')
      RETURNING id, term_id
      `,
      [lessonId]
    );

    if (!lessonRes.rows.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Lesson cannot be published'
      });
    }

    const { term_id } = lessonRes.rows[0];

    // 2️⃣ Get program ID from term
    const programRes = await client.query(
      `
      SELECT program_id
      FROM terms
      WHERE id = $1
      `,
      [term_id]
    );

    const programId = programRes.rows[0].program_id;

    // 3️⃣ Publish program (if not already)
    await client.query(
      `
      UPDATE programs
      SET status = 'published',
          published_at = COALESCE(published_at, now()),
          updated_at = now()
      WHERE id = $1
        AND status != 'published'
      `,
      [programId]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Lesson and program published successfully',
      lessonId,
      programId
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to publish lesson' });
  } finally {
    client.release();
  }
};



exports.archiveLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const result = await db.query(
      `
      UPDATE lessons
      SET status = 'archived',
          updated_at = now()
      WHERE id = $1
        AND status = 'published'
      RETURNING *
      `,
      [lessonId]
    );

    // only published lessons can be archieved
    if (!result.rows.length) {
      return res.status(400).json({
        error: 'Only published lessons can be archived'
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to archive lesson' });
  }
};

// controllers/lessonController.js

exports.getLessonById = async (req, res) => {
  try {
    const { programId, termId, lessonId } = req.params;

    const result = await db.query(
      `
      SELECT l.*
      FROM lessons l
      JOIN terms t ON l.term_id = t.id
      JOIN programs p ON t.program_id = p.id
      WHERE l.id = $1
        AND t.id = $2
        AND p.id = $3
      `,
      [lessonId, termId, programId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Lesson not found"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({
      message: "Failed to fetch lesson"
    });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const {
      lesson_number,
      title,
      content_type,
      duration_ms,
      is_paid,
      content_language_primary,
      content_languages_available,
      content_urls_by_language,
    } = req.body;

    const result = await db.query(
      `
      UPDATE lessons
      SET
        lesson_number = $1,
        title = $2,
        content_type = $3,
        duration_ms = $4,
        is_paid = $5,
        content_language_primary = $6,
        content_languages_available = $7,
        content_urls_by_language = $8,
        updated_at = now()
      WHERE id = $9
      RETURNING *
      `,
      [
        lesson_number,
        title,
        content_type,
        duration_ms,
        is_paid,
        content_language_primary,
        content_languages_available,
        content_urls_by_language,
        lessonId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update lesson error:", err);
    res.status(500).json({ error: "Failed to update lesson" });
  }
};


