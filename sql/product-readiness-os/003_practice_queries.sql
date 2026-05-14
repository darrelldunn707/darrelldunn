/*
Product Readiness OS SQLite Practice Database
003_practice_queries.sql

Purpose:
Practice SQL using Product Readiness OS launch, feedback, routing, readiness, and risk data.

This file is organized into:
1. Beginner queries
2. Intermediate queries
3. Advanced queries
4. SQL notes

Important schema note:
feedback_clusters is launch-specific.

When joining feedback_records to feedback_clusters, use BOTH launch_id and cluster_id:

  JOIN feedback_clusters fc
    ON fr.launch_id = fc.launch_id
   AND fr.cluster_id = fc.cluster_id

Do not join only on cluster_id once the database contains multiple launches.
*/

--------------------------------------------------------------------------------
-- SECTION 1: BEGINNER QUERIES
-- Basic SELECT, WHERE, ORDER BY, GROUP BY, and simple reporting.
--------------------------------------------------------------------------------

-- 1. Show all feedback records, newest first
-- Business question:
-- What feedback has recently entered the system?
SELECT
  feedback_id,
  launch_id,
  source_channel,
  customer_segment,
  category,
  severity,
  status,
  likely_owner,
  ingested_at
FROM feedback_records
ORDER BY ingested_at DESC;


-- 2. Count feedback by category
-- Business question:
-- Which feedback categories are appearing most often?
SELECT
  category,
  COUNT(*) AS feedback_count
FROM feedback_records
GROUP BY category
ORDER BY feedback_count DESC;


-- 3. Find launch-blocking or serious feedback
-- Business question:
-- Which feedback records may require urgent attention before launch?
SELECT
  feedback_id,
  launch_id,
  customer_segment,
  feedback_text,
  severity,
  status,
  likely_owner
FROM feedback_records
WHERE severity IN ('Sev 1', 'Sev 2', 'Critical', 'High')
   OR status = 'Needs review'
ORDER BY severity, ingested_at DESC;


-- 4. Show clusters with their routed tasks
-- Business question:
-- Which feedback clusters have been converted into routed tasks?
-- Technical note:
-- Because clusters are now launch-specific, join on launch_id and cluster_id.
SELECT
  fc.launch_id,
  fc.cluster_id,
  fc.cluster_name,
  fc.category,
  rt.task_title,
  rt.department,
  rt.priority,
  rt.status
FROM feedback_clusters fc
LEFT JOIN routed_tasks rt
  ON fc.launch_id = rt.launch_id
 AND fc.cluster_id = rt.cluster_id
ORDER BY fc.launch_id, rt.priority, fc.cluster_name;


-- 5. Count tasks by department and status
-- Business question:
-- Which departments have open, in-progress, or review-needed work?
SELECT
  department,
  status,
  COUNT(*) AS task_count
FROM routed_tasks
GROUP BY department, status
ORDER BY department, task_count DESC;


-- 6. Show readiness items that are not complete
-- Business question:
-- Which launch readiness items are blocked, at risk, or still unfinished?
SELECT
  launch_id,
  workstream,
  item_label,
  status,
  owner,
  due_date,
  notes
FROM readiness_items
WHERE status != 'Complete'
ORDER BY due_date;


-- 7. Show risks by severity
-- Business question:
-- Which risks should be reviewed first?
SELECT
  launch_id,
  risk_title,
  severity,
  affected_audience,
  owner,
  status,
  escalation_path
FROM risks
ORDER BY
  CASE severity
    WHEN 'Critical' THEN 1
    WHEN 'High' THEN 2
    WHEN 'Medium' THEN 3
    WHEN 'Low' THEN 4
    ELSE 5
  END;


-- 8. Count feedback by category and severity
-- Business question:
-- Which categories have the most serious feedback?
SELECT
  category,
  severity,
  COUNT(*) AS feedback_count
FROM feedback_records
GROUP BY category, severity
ORDER BY category, feedback_count DESC;


-- 9. Find categories with the most unresolved feedback
-- Business question:
-- Which feedback areas still need attention?
SELECT
  category,
  COUNT(*) AS unresolved_count
FROM feedback_records
WHERE status != 'Resolved'
GROUP BY category
ORDER BY unresolved_count DESC;


-- 10. Find feedback that needs human review
-- Business question:
-- What should be in the human review queue?
SELECT
  feedback_id,
  launch_id,
  category,
  severity,
  confidence_score,
  confidence_level,
  human_review_needed,
  feedback_text
FROM feedback_records
WHERE human_review_needed = 'Review recommended'
   OR confidence_score < 80
ORDER BY confidence_score ASC;


-- 11. Calculate average confidence score by category
-- Business question:
-- Which categories may need clearer classification rules or better taxonomy?
SELECT
  category,
  ROUND(AVG(confidence_score), 1) AS avg_confidence_score,
  COUNT(*) AS record_count
FROM feedback_records
GROUP BY category
ORDER BY avg_confidence_score ASC;


-- 12. Feedback trend by day
-- Business question:
-- Is total feedback increasing or decreasing over time?
SELECT
  DATE(ingested_at) AS feedback_day,
  COUNT(*) AS feedback_count
FROM feedback_records
GROUP BY DATE(ingested_at)
ORDER BY feedback_day;


-- 13. Feedback trend by day and category
-- Business question:
-- Which feedback categories are growing during the launch window?
SELECT
  DATE(ingested_at) AS feedback_day,
  category,
  COUNT(*) AS feedback_count
FROM feedback_records
GROUP BY DATE(ingested_at), category
ORDER BY feedback_day, feedback_count DESC;


-- 14. Find inconsistent routing for Authentication / SSO
-- Business question:
-- Are authentication-related records being routed to the expected owner?
SELECT
  feedback_id,
  launch_id,
  category,
  likely_owner,
  recommended_route,
  feedback_text
FROM feedback_records
WHERE category = 'Authentication / SSO'
  AND likely_owner != 'Identity Engineering';


-- 15. Find inconsistent routing for Documentation
-- Business question:
-- Are documentation-related records being routed to the expected owner?
SELECT
  feedback_id,
  launch_id,
  category,
  likely_owner,
  recommended_route,
  feedback_text
FROM feedback_records
WHERE category = 'Documentation'
  AND likely_owner != 'Documentation';


--------------------------------------------------------------------------------
-- SECTION 2: INTERMEDIATE QUERIES
-- Joins, CASE logic, multi-table reporting, launch-specific analysis.
--------------------------------------------------------------------------------

-- 16. Join feedback records to clusters
-- Business question:
-- Which feedback records belong to which duplicate or trend clusters?
-- Technical note:
-- This uses the required launch-specific cluster join.
SELECT
  fr.feedback_id,
  fr.launch_id,
  fr.category,
  fr.severity,
  fr.status,
  fc.cluster_name,
  fc.issue_type,
  fc.priority_signal
FROM feedback_records fr
LEFT JOIN feedback_clusters fc
  ON fr.launch_id = fc.launch_id
 AND fr.cluster_id = fc.cluster_id
ORDER BY fr.launch_id, fc.cluster_name, fr.ingested_at;


-- 17. Count feedback per cluster
-- Business question:
-- Which clusters have the most feedback and severe impact?
SELECT
  fc.launch_id,
  fc.cluster_id,
  fc.cluster_name,
  fc.category,
  COUNT(fr.feedback_id) AS feedback_count,
  SUM(
    CASE
      WHEN fr.severity IN ('Sev 1', 'Sev 2', 'Critical', 'High') THEN 1
      ELSE 0
    END
  ) AS severe_count
FROM feedback_clusters fc
LEFT JOIN feedback_records fr
  ON fc.launch_id = fr.launch_id
 AND fc.cluster_id = fr.cluster_id
GROUP BY
  fc.launch_id,
  fc.cluster_id,
  fc.cluster_name,
  fc.category
ORDER BY feedback_count DESC, severe_count DESC;


-- 18. Find clusters without routed tasks
-- Business question:
-- Which clusters are producing feedback but have not become routed tasks?
SELECT
  fc.launch_id,
  fc.cluster_id,
  fc.cluster_name,
  fc.category,
  COUNT(fr.feedback_id) AS feedback_count
FROM feedback_clusters fc
LEFT JOIN feedback_records fr
  ON fc.launch_id = fr.launch_id
 AND fc.cluster_id = fr.cluster_id
LEFT JOIN routed_tasks rt
  ON fc.launch_id = rt.launch_id
 AND fc.cluster_id = rt.cluster_id
WHERE rt.task_id IS NULL
GROUP BY
  fc.launch_id,
  fc.cluster_id,
  fc.cluster_name,
  fc.category
ORDER BY feedback_count DESC;


-- 19. Compare routed task priority with actual feedback severity
-- Business question:
-- Does task priority match the severity pattern in the underlying feedback?
SELECT
  rt.task_id,
  rt.launch_id,
  rt.task_title,
  rt.department,
  rt.priority AS task_priority,
  COUNT(fr.feedback_id) AS related_feedback_count,
  SUM(
    CASE
      WHEN fr.severity IN ('Sev 1', 'Sev 2', 'Critical', 'High') THEN 1
      ELSE 0
    END
  ) AS severe_feedback_count
FROM routed_tasks rt
LEFT JOIN feedback_records fr
  ON rt.launch_id = fr.launch_id
 AND rt.cluster_id = fr.cluster_id
GROUP BY
  rt.task_id,
  rt.launch_id,
  rt.task_title,
  rt.department,
  rt.priority
ORDER BY severe_feedback_count DESC, related_feedback_count DESC;


-- 20. Show category volume with severe feedback count
-- Business question:
-- Which categories combine high volume with high severity?
SELECT
  launch_id,
  category,
  COUNT(*) AS total_feedback,
  SUM(
    CASE
      WHEN severity IN ('Sev 1', 'Sev 2', 'Critical', 'High') THEN 1
      ELSE 0
    END
  ) AS severe_feedback_count
FROM feedback_records
GROUP BY launch_id, category
ORDER BY launch_id, severe_feedback_count DESC, total_feedback DESC;


-- 21. Create a launch risk signal from feedback
-- Business question:
-- Which categories should be monitored, watched closely, or treated as launch risks?
SELECT
  launch_id,
  category,
  COUNT(*) AS total_feedback,
  SUM(
    CASE
      WHEN severity = 'Sev 2' THEN 1
      ELSE 0
    END
  ) AS sev2_count,
  SUM(
    CASE
      WHEN status = 'Needs review' THEN 1
      ELSE 0
    END
  ) AS needs_review_count,
  CASE
    WHEN SUM(CASE WHEN severity = 'Sev 2' THEN 1 ELSE 0 END) >= 3 THEN 'Launch risk'
    WHEN COUNT(*) >= 4 THEN 'Watch closely'
    ELSE 'Monitor'
  END AS launch_signal
FROM feedback_records
GROUP BY launch_id, category
ORDER BY launch_id, sev2_count DESC, total_feedback DESC;


-- 22. Build an owner workload view
-- Business question:
-- Which owners are carrying the most active or severe feedback?
SELECT
  likely_owner,
  COUNT(*) AS total_feedback,
  SUM(
    CASE
      WHEN status IN ('New', 'Needs review', 'Routed', 'In progress') THEN 1
      ELSE 0
    END
  ) AS active_feedback,
  SUM(
    CASE
      WHEN severity IN ('Sev 1', 'Sev 2', 'Critical', 'High') THEN 1
      ELSE 0
    END
  ) AS severe_feedback
FROM feedback_records
GROUP BY likely_owner
ORDER BY severe_feedback DESC, active_feedback DESC;


-- 23. Create a feedback triage queue
-- Business question:
-- Which unresolved feedback should be reviewed first?
SELECT
  feedback_id,
  launch_id,
  severity,
  status,
  confidence_score,
  likely_owner,
  category,
  feedback_text,
  CASE
    WHEN severity IN ('Sev 1', 'Critical') THEN 1
    WHEN severity IN ('Sev 2', 'High') THEN 2
    WHEN status = 'Needs review' THEN 3
    WHEN confidence_score < 80 THEN 4
    ELSE 5
  END AS triage_rank
FROM feedback_records
WHERE status != 'Resolved'
ORDER BY triage_rank, ingested_at;


-- 24. Human review rate by launch
-- Business question:
-- Which launches are producing the highest percentage of records needing human review?
SELECT
  launch_id,
  COUNT(*) AS total_feedback,
  SUM(
    CASE
      WHEN human_review_needed = 'Review recommended' THEN 1
      ELSE 0
    END
  ) AS human_review_count,
  ROUND(
    100.0 * SUM(
      CASE
        WHEN human_review_needed = 'Review recommended' THEN 1
        ELSE 0
      END
    ) / COUNT(*),
    1
  ) AS human_review_rate_percent
FROM feedback_records
GROUP BY launch_id
ORDER BY human_review_rate_percent DESC;


-- 25. Average confidence score by category and cluster
-- Business question:
-- Which clusters have lower classification confidence and may need review?
-- This replaces the broken draft query:
-- SELECT categroy, AVG(confidence_score) FROM f
SELECT
  fr.launch_id,
  fc.cluster_name,
  fr.category,
  ROUND(AVG(fr.confidence_score), 1) AS avg_confidence_score,
  COUNT(*) AS feedback_count
FROM feedback_records fr
LEFT JOIN feedback_clusters fc
  ON fr.launch_id = fc.launch_id
 AND fr.cluster_id = fc.cluster_id
GROUP BY
  fr.launch_id,
  fc.cluster_name,
  fr.category
ORDER BY avg_confidence_score ASC, feedback_count DESC;


--------------------------------------------------------------------------------
-- SECTION 3: ADVANCED QUERIES
-- Window functions, CTEs, HAVING, data quality checks, launch comparisons.
--------------------------------------------------------------------------------

-- 26. Rank feedback categories by volume
-- Business question:
-- What are the top feedback categories overall?
SELECT
  category,
  COUNT(*) AS feedback_count,
  RANK() OVER (
    ORDER BY COUNT(*) DESC
  ) AS volume_rank
FROM feedback_records
GROUP BY category;


-- 27. Rank categories within each launch
-- Business question:
-- What are the top feedback categories for each launch?
SELECT
  launch_id,
  category,
  feedback_count,
  RANK() OVER (
    PARTITION BY launch_id
    ORDER BY feedback_count DESC
  ) AS category_rank_within_launch
FROM (
  SELECT
    launch_id,
    category,
    COUNT(*) AS feedback_count
  FROM feedback_records
  GROUP BY launch_id, category
)
ORDER BY launch_id, category_rank_within_launch;


-- 28. Find the newest feedback per category
-- Business question:
-- What is the latest signal for each category?
SELECT
  feedback_id,
  launch_id,
  category,
  severity,
  status,
  feedback_text,
  ingested_at
FROM (
  SELECT
    feedback_records.*,
    ROW_NUMBER() OVER (
      PARTITION BY category
      ORDER BY ingested_at DESC
    ) AS row_num
  FROM feedback_records
)
WHERE row_num = 1
ORDER BY ingested_at DESC;


-- 29. Find the newest feedback per launch and category
-- Business question:
-- What is the latest signal for each category within each launch?
SELECT
  feedback_id,
  launch_id,
  category,
  severity,
  status,
  feedback_text,
  ingested_at
FROM (
  SELECT
    feedback_records.*,
    ROW_NUMBER() OVER (
      PARTITION BY launch_id, category
      ORDER BY ingested_at DESC
    ) AS row_num
  FROM feedback_records
)
WHERE row_num = 1
ORDER BY launch_id, ingested_at DESC;


-- 30. Detect likely under-prioritized tasks
-- Business question:
-- Which tasks may need a priority increase based on Sev 2 feedback volume?
SELECT
  rt.task_id,
  rt.launch_id,
  rt.task_title,
  rt.department,
  rt.priority,
  COUNT(fr.feedback_id) AS total_feedback,
  SUM(
    CASE
      WHEN fr.severity = 'Sev 2' THEN 1
      ELSE 0
    END
  ) AS sev2_count
FROM routed_tasks rt
JOIN feedback_records fr
  ON rt.launch_id = fr.launch_id
 AND rt.cluster_id = fr.cluster_id
GROUP BY
  rt.task_id,
  rt.launch_id,
  rt.task_title,
  rt.department,
  rt.priority
HAVING sev2_count >= 2
   AND rt.priority != 'High'
ORDER BY sev2_count DESC;


-- 31. Use a CTE to summarize launch health from feedback
-- Business question:
-- Which launches have the strongest negative signal based on unresolved and severe feedback?
WITH launch_feedback_summary AS (
  SELECT
    launch_id,
    COUNT(*) AS total_feedback,
    SUM(
      CASE
        WHEN status != 'Resolved' THEN 1
        ELSE 0
      END
    ) AS unresolved_feedback,
    SUM(
      CASE
        WHEN severity IN ('Sev 1', 'Sev 2', 'Critical', 'High') THEN 1
        ELSE 0
      END
    ) AS severe_feedback,
    SUM(
      CASE
        WHEN human_review_needed = 'Review recommended' THEN 1
        ELSE 0
      END
    ) AS human_review_count
  FROM feedback_records
  GROUP BY launch_id
)
SELECT
  l.launch_id,
  l.launch_name,
  total_feedback,
  unresolved_feedback,
  severe_feedback,
  human_review_count,
  CASE
    WHEN severe_feedback >= 10 OR human_review_count >= 20 THEN 'High launch risk'
    WHEN unresolved_feedback >= 25 THEN 'Watch closely'
    ELSE 'Monitor'
  END AS launch_health_signal
FROM launch_feedback_summary s
JOIN launches l
  ON s.launch_id = l.launch_id
ORDER BY
  severe_feedback DESC,
  unresolved_feedback DESC,
  human_review_count DESC;


-- 32. Find possible data quality issues
-- Business question:
-- Which records may have missing or questionable classification data?
SELECT
  feedback_id,
  launch_id,
  cluster_id,
  category,
  severity,
  status,
  confidence_score,
  human_review_needed,
  likely_owner,
  recommended_route
FROM feedback_records
WHERE feedback_text IS NULL
   OR TRIM(feedback_text) = ''
   OR category IS NULL
   OR TRIM(category) = ''
   OR severity IS NULL
   OR status IS NULL
   OR confidence_score IS NULL
   OR confidence_score < 0
   OR confidence_score > 100
   OR likely_owner IS NULL
   OR TRIM(likely_owner) = ''
ORDER BY launch_id, feedback_id;


-- 33. Find feedback records whose launch-cluster relationship does not resolve
-- Business question:
-- Are any feedback records pointing to a missing or mismatched cluster?
-- Expected result should be zero rows if foreign keys and seed data are correct.
SELECT
  fr.feedback_id,
  fr.launch_id,
  fr.cluster_id,
  fr.category,
  fr.feedback_text
FROM feedback_records fr
LEFT JOIN feedback_clusters fc
  ON fr.launch_id = fc.launch_id
 AND fr.cluster_id = fc.cluster_id
WHERE fc.cluster_id IS NULL;


-- 34. Create a dashboard-ready launch summary
-- Business question:
-- What high-level metrics could feed a launch readiness dashboard?
SELECT
  l.launch_id,
  l.launch_name,
  l.launch_phase,
  l.support_risk_level,
  COUNT(fr.feedback_id) AS total_feedback,
  SUM(
    CASE
      WHEN fr.status != 'Resolved' THEN 1
      ELSE 0
    END
  ) AS unresolved_feedback,
  SUM(
    CASE
      WHEN fr.severity IN ('Sev 1', 'Sev 2', 'Critical', 'High') THEN 1
      ELSE 0
    END
  ) AS severe_feedback,
  SUM(
    CASE
      WHEN fr.human_review_needed = 'Review recommended' THEN 1
      ELSE 0
    END
  ) AS human_review_count,
  COUNT(DISTINCT fr.cluster_id) AS active_cluster_count
FROM launches l
LEFT JOIN feedback_records fr
  ON l.launch_id = fr.launch_id
GROUP BY
  l.launch_id,
  l.launch_name,
  l.launch_phase,
  l.support_risk_level
ORDER BY severe_feedback DESC, unresolved_feedback DESC;


-- 35. Use UNION to combine readiness items and risks into one review queue
-- Business question:
-- What launch-readiness items and risks should be reviewed in one combined queue?
SELECT
  launch_id,
  'Readiness Item' AS item_type,
  item_label AS title,
  status,
  owner,
  due_date AS review_date
FROM readiness_items
WHERE status != 'Complete'

UNION ALL

SELECT
  launch_id,
  'Risk' AS item_type,
  risk_title AS title,
  status,
  owner,
  NULL AS review_date
FROM risks
WHERE status != 'Closed'
ORDER BY launch_id, item_type, review_date;


-- 36. Use a self join to find feedback records in the same launch and category
-- Business question:
-- Which feedback records may be related because they share launch and category?
-- Note:
-- This is a basic self join example. Real dedupe logic would need text similarity.
SELECT
  a.feedback_id AS feedback_a,
  b.feedback_id AS feedback_b,
  a.launch_id,
  a.category,
  a.severity AS severity_a,
  b.severity AS severity_b
FROM feedback_records a
JOIN feedback_records b
  ON a.launch_id = b.launch_id
 AND a.category = b.category
 AND a.feedback_id < b.feedback_id
ORDER BY a.launch_id, a.category, a.feedback_id
LIMIT 50;


-- 37. Use HAVING to find categories with enough volume to deserve review
-- Business question:
-- Which categories have enough feedback volume to become a trend, not just an isolated issue?
SELECT
  launch_id,
  category,
  COUNT(*) AS feedback_count
FROM feedback_records
GROUP BY launch_id, category
HAVING COUNT(*) >= 5
ORDER BY launch_id, feedback_count DESC;


-- 38. Find source channels producing severe feedback
-- Business question:
-- Which feedback channels are surfacing the highest-severity launch signals?
SELECT
  source_channel,
  COUNT(*) AS total_feedback,
  SUM(
    CASE
      WHEN severity IN ('Sev 1', 'Sev 2', 'Critical', 'High') THEN 1
      ELSE 0
    END
  ) AS severe_feedback_count,
  ROUND(
    100.0 * SUM(
      CASE
        WHEN severity IN ('Sev 1', 'Sev 2', 'Critical', 'High') THEN 1
        ELSE 0
      END
    ) / COUNT(*),
    1
  ) AS severe_feedback_rate_percent
FROM feedback_records
GROUP BY source_channel
ORDER BY severe_feedback_rate_percent DESC, severe_feedback_count DESC;


--------------------------------------------------------------------------------
-- SECTION 4: SQL NOTES
-- Preserved and cleaned from the original notes.
--------------------------------------------------------------------------------

/*
Become dangerous with:

SELECT
WHERE
JOIN
GROUP BY
CASE WHEN
CTEs
window functions
date filtering
trend analysis
data quality checks
dashboard-ready queries

SQL focused on:

feedback_records
feedback_clusters
routed_tasks
readiness_items
risks
launches
teams

Important project-specific join:

feedback_clusters is now launch-specific.

Correct join:
  JOIN feedback_clusters fc
    ON fr.launch_id = fc.launch_id
   AND fr.cluster_id = fc.cluster_id

Avoid this once multiple launches exist:
  JOIN feedback_clusters fc
    ON fr.cluster_id = fc.cluster_id

Useful SQL concepts for this project:

-- SELF JOIN use case:
-- Compare feedback records inside the same launch/category/cluster to look for possible duplicates.
-- Real duplicate detection would require better text similarity logic, but a self join is useful for learning.

-- UNION use case:
-- Combine different operational queues, such as readiness_items and risks, into one review list.

-- Aggregates with filtering:
-- Aggregates like COUNT(), SUM(), and AVG() happen after grouping.
-- Use HAVING to filter grouped results.
-- Example:
--   GROUP BY launch_id, category
--   HAVING COUNT(*) >= 5

-- JOIN notes:
-- JOIN by itself usually means INNER JOIN.
-- LEFT JOIN keeps all rows from the left table, even when there is no match on the right table.
-- LEFT JOIN is very useful for finding missing workflow steps, such as clusters without routed tasks.

-- OUTER JOIN notes:
-- SQLite supports LEFT JOIN.
-- SQLite does not support RIGHT JOIN in older versions the same way some other databases do.
-- For learning, focus on LEFT JOIN first.

-- UNION notes:
-- UNION combines rows from multiple SELECT statements.
-- UNION removes duplicates by default.
-- UNION ALL keeps duplicates and is usually clearer for operational queue reporting.

-- IN notes:
-- IN checks whether a value matches anything in a list.
-- Example:
--   WHERE severity IN ('Sev 1', 'Sev 2')

-- WITH / CTE notes:
-- WITH creates a Common Table Expression.
-- CTEs make larger queries easier to read.
-- Example:
--   WITH summary AS (
--     SELECT launch_id, COUNT(*) AS total_feedback
--     FROM feedback_records
--     GROUP BY launch_id
--   )
--   SELECT * FROM summary;

-- Temporary table note:
-- CREATE TEMPORARY TABLE can be useful for storing intermediate results during analysis.
-- You probably do not need this yet for the Product Readiness OS practice database.

-- Stored procedures note:
-- MySQL supports CREATE PROCEDURE and CALL stored_procedure().
-- SQLite does not support stored procedures in the same way.
-- For this SQLite project, skip stored procedures for now.

-- MySQL stored procedure pattern:
-- DELIMITER //
-- CREATE PROCEDURE stored_procedure_name()
-- BEGIN
--   SELECT ...
-- END //
-- DELIMITER ;

-- Parameters:
-- Parameters are variables passed as input into a stored procedure.
-- More relevant to MySQL/PostgreSQL than this SQLite practice database.

-- Triggers and events:
-- Useful later for automated behavior, but not needed yet.
-- Example future use:
-- When a routed task is marked Resolved, update related readiness/risk status.

-- TRIM example:
-- TRIM(TRAILING '.' FROM field_name)
-- Note: syntax differs across SQL dialects.

-- ALTER TABLE examples:
-- SQLite supports some ALTER TABLE operations, but not all MySQL-style changes.
-- MySQL-style:
--   ALTER TABLE table_name
--   MODIFY COLUMN `date` DATE;
--
-- SQLite-style changes often require rebuilding the table for complex alterations.

-- Drop column:
-- Newer SQLite versions support:
--   ALTER TABLE table_name
--   DROP COLUMN field_name;
--
-- For this project, prefer updating 001_schema.sql and rebuilding while the database is still early.
*/