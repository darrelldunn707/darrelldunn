-- Check status values
SELECT
  status,
  COUNT(*) AS record_count
FROM feedback_records
GROUP BY status
ORDER BY record_count DESC;

-- Check severity values
SELECT
  severity,
  COUNT(*) AS record_count
FROM feedback_records
GROUP BY severity
ORDER BY record_count DESC;

-- Check human review values
SELECT
  human_review_needed,
  COUNT(*) AS record_count
FROM feedback_records
GROUP BY human_review_needed
ORDER BY record_count DESC;

-- Check confidence score bounds
SELECT
  COUNT(*) AS invalid_confidence_count
FROM feedback_records
WHERE confidence_score < 0
   OR confidence_score > 100
   OR confidence_score IS NULL;