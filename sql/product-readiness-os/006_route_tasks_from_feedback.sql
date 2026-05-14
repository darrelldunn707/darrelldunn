/*
Product Readiness OS SQLite Practice Database
006_route_tasks_from_feedback.sql

Purpose:
Creates routed_tasks from launch-specific feedback clusters.

Run after:
1. 001_schema.sql
2. 002_seed_data.sql
3. 004_more_launches_and_clusters.sql
4. CSV import into feedback_records

This file creates one task per launch-specific cluster that has feedback
but does not already have a routed task.
*/

INSERT INTO routed_tasks (
  launch_id,
  cluster_id,
  task_title,
  department,
  priority,
  status,
  source_signal,
  total_reports,
  severe_impact_count,
  trend,
  created_at
)
SELECT
  fr.launch_id,
  fc.cluster_id,

  'Review and resolve: ' || fc.cluster_name AS task_title,

  COALESCE(t.team_name, 'Product Ops') AS department,

  CASE
    WHEN SUM(CASE WHEN fr.severity = 'Sev 1' THEN 1 ELSE 0 END) >= 1 THEN 'High'
    WHEN SUM(CASE WHEN fr.severity = 'Sev 2' THEN 1 ELSE 0 END) >= 5 THEN 'High'
    WHEN COUNT(fr.feedback_id) >= 40 THEN 'High'
    WHEN COUNT(fr.feedback_id) >= 15 THEN 'Medium'
    ELSE 'Low'
  END AS priority,

  CASE
    WHEN SUM(
      CASE
        WHEN fr.status = 'Needs review'
          OR fr.human_review_needed = 'Review recommended'
        THEN 1
        ELSE 0
      END
    ) >= 10 THEN 'Needs review'
    ELSE 'Open'
  END AS status,

  fc.priority_signal AS source_signal,

  COUNT(fr.feedback_id) AS total_reports,

  SUM(
    CASE
      WHEN fr.severity IN ('Sev 1', 'Sev 2') THEN 1
      ELSE 0
    END
  ) AS severe_impact_count,

  CASE
    WHEN COUNT(fr.feedback_id) >= 40 THEN 'Rising'
    WHEN COUNT(fr.feedback_id) >= 15 THEN 'Watching'
    ELSE 'Monitor'
  END AS trend,

  datetime('now') AS created_at

FROM feedback_records fr
JOIN feedback_clusters fc
  ON fr.launch_id = fc.launch_id
 AND fr.cluster_id = fc.cluster_id
LEFT JOIN teams t
  ON fc.suggested_owner_team_id = t.team_id
LEFT JOIN routed_tasks rt
  ON fr.launch_id = rt.launch_id
 AND fr.cluster_id = rt.cluster_id

WHERE rt.task_id IS NULL

GROUP BY
  fr.launch_id,
  fc.cluster_id,
  fc.cluster_name,
  fc.priority_signal,
  t.team_name;