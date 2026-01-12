const db = require("../db");

/**
 * GET /catalog/programs
 * Published programs with poster thumbnails
 */
exports.getPublishedPrograms = async (req, res) => {
  try {
    const { limit = 12, offset = 0 } = req.query;

    const programsRes = await db.query(
  `
  SELECT DISTINCT
    p.id,
    p.title,
    p.description,
    p.language_primary,
    p.published_at
  FROM programs p
  JOIN terms t ON t.program_id = p.id
  JOIN lessons l ON l.term_id = t.id
  WHERE p.status = 'published'
    AND l.status = 'published'
  ORDER BY p.published_at DESC
  LIMIT $1 OFFSET $2
  `,
  [limit, offset]
);

    const programIds = programsRes.rows.map(p => p.id);

    // Fetch program posters
    const assetsRes = await db.query(
      `
      SELECT program_id, language, variant, url
      FROM program_assets
      WHERE program_id = ANY($1)
        AND asset_type = 'poster'
      `,
      [programIds]
    );

    // Map assets
    const assetMap = {};
    for (const a of assetsRes.rows) {
      if (!assetMap[a.program_id]) assetMap[a.program_id] = {};
      if (!assetMap[a.program_id][a.language])
        assetMap[a.program_id][a.language] = {};
      assetMap[a.program_id][a.language][a.variant] = a.url;
    }

    const response = programsRes.rows.map(p => ({
      ...p,
      assets: {
        posters: assetMap[p.id] || {}
      }
    }));

    res.json(response);

  } catch (err) {
    console.error("Catalog programs error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /catalog/programs/:programId
 */
exports.getProgramDetail = async (req, res) => {
  const { programId } = req.params;

  try {
    const programRes = await db.query(
      `
      SELECT *
      FROM programs
      WHERE id = $1 AND status = 'published'
      `,
      [programId]
    );
    console.log("reached after query 1");

    if (!programRes.rows.length) {
      return res.status(404).json({ error: "Program not found" });
    }

    const program = programRes.rows[0];

    // Program posters
    const postersRes = await db.query(
      `
      SELECT language, variant, url
      FROM program_assets
      WHERE program_id = $1 AND asset_type = 'poster'
      `,
      [programId]
    );
    console.log("reached after query 2");

    const posters = {};
    postersRes.rows.forEach(p => {
      if (!posters[p.language]) posters[p.language] = {};
      posters[p.language][p.variant] = p.url;
    });

    // Lessons + thumbnails
    const lessonsRes = await db.query(
      `
      SELECT
        l.id,
        l.lesson_number,
        l.title,
        l.duration_ms,
        la.language,
        la.variant,
        la.url
      FROM lessons l
      LEFT JOIN lesson_assets la
        ON la.lesson_id = l.id AND la.asset_type = 'thumbnail'
      WHERE l.status = 'published'
        AND l.term_id IN (
          SELECT id FROM terms WHERE program_id = $1
        )
      ORDER BY l.lesson_number
      `,
      [programId]
    );
    console.log("reached after query 3")

    const lessonsMap = {};
    lessonsRes.rows.forEach(row => {
      if (!lessonsMap[row.id]) {
        lessonsMap[row.id] = {
          id: row.id,
          lesson_number: row.lesson_number,
          title: row.title,
          duration_ms: row.duration_ms,
          assets: { thumbnails: {} }
        };
      }

      if (row.language && row.variant) {
        if (!lessonsMap[row.id].assets.thumbnails[row.language]) {
          lessonsMap[row.id].assets.thumbnails[row.language] = {};
        }
        lessonsMap[row.id].assets.thumbnails[row.language][row.variant] = row.url;
      }
    });

    res.json({
      program: {
        ...program,
        assets: { posters }
      },
      lessons: Object.values(lessonsMap)
    });

  } catch (err) {
    console.error("Catalog detail error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
