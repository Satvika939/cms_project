const db = require('../db');
const logger = require('../utils/logger');

/**
 * Publishes scheduled lessons whose publish_at <= now()
 * Also auto-publishes the parent program if needed
 */
async function autoPublishLessons() {
  logger.info('Auto-publish worker started');
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // 1️⃣ Pick scheduled lessons safely
    const { rows: lessons } = await client.query(`
      SELECT id
      FROM lessons
      WHERE status = 'scheduled'
        AND publish_at <= now()
      FOR UPDATE SKIP LOCKED
      LIMIT 10;
    `);

    for (const lesson of lessons) {
      // 2️⃣ Publish lesson
      await client.query(
        `
        UPDATE lessons
        SET status = 'published',
            published_at = now()
        WHERE id = $1;
        `,
        [lesson.id]
      );

      // 3️⃣ Auto-publish program
      await client.query(
        `
        UPDATE programs
        SET status = 'published',
            published_at = COALESCE(published_at, now())
        WHERE id = (
          SELECT t.program_id
          FROM terms t
          JOIN lessons l ON l.term_id = t.id
          WHERE l.id = $1
        )
        AND status <> 'published';
        `,
        [lesson.id]
      );
    }

    await client.query('COMMIT');

    if (lessons.length > 0) {
      console.log(`✅ Auto-published ${lessons.length} lesson(s)`);
    }
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Worker failed', err);
    console.error('❌ Auto-publish worker error:', err);
  } finally {
    client.release();
  }
}

module.exports = autoPublishLessons;
