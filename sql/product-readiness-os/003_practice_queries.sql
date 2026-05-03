-- 1. Show all feedback records, newest first
SELECT
  feedback_id,
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
SELECT
  category,
  COUNT(*) AS feedback_count
FROM feedback_records
GROUP BY category
ORDER BY feedback_count DESC;

-- 3. Find launch-blocking or serious feedback
SELECT
  feedback_id,
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
SELECT
  fc.cluster_name,
  fc.category,
  rt.task_title,
  rt.department,
  rt.priority,
  rt.status
FROM feedback_clusters fc
LEFT JOIN routed_tasks rt
  ON fc.cluster_id = rt.cluster_id
ORDER BY rt.priority, fc.cluster_name;

-- 5. Count open tasks by department
SELECT
  department,
  status,
  COUNT(*) AS task_count
FROM routed_tasks
GROUP BY department, status
ORDER BY department, task_count DESC;

-- 6. Show readiness items that are not complete
SELECT
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
SELECT
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

  