/*
Product Readiness OS SQLite Practice Database
004_more_launches_and_clusters.sql

Purpose:
Adds two additional launches and launch-specific feedback clusters.

Run order:
1. 001_schema.sql
2. 002_seed_data.sql
3. 004_more_launches_and_clusters.sql
4. Optional: generated feedback record imports
5. 003_practice_queries.sql

Important:
This file assumes the starter schema and starter seed data already exist.

Current launches after this file:
1. Enterprise Knowledge Connector Beta
2. Admin Analytics Dashboard Rollout
3. Team Memory Controls Pilot

Schema note:
feedback_clusters is launch-specific.

Each cluster has:
- cluster_id
- launch_id
- cluster_name
- category
- subcategory
- issue_type
- suggested_owner_team_id
- priority_signal

The pair (launch_id, cluster_name) must be unique.
*/

--------------------------------------------------------------------------------
-- ADD LAUNCHES
--------------------------------------------------------------------------------

INSERT INTO launches (
  launch_id,
  launch_name,
  launch_date,
  launch_phase,
  target_audience,
  main_goal,
  support_risk_level
)
VALUES
  (
    2,
    'Admin Analytics Dashboard Rollout',
    '2026-06-18',
    'Rollout readiness review',
    'Enterprise admins, customer success teams, support leads, and business operations reviewers',
    'Validate that admins can interpret usage, adoption, and support metrics with clear definitions, reliable freshness, and prepared escalation paths.',
    'Medium'
  ),
  (
    3,
    'Team Memory Controls Pilot',
    '2026-07-09',
    'Pilot readiness review',
    'Enterprise admins, workspace owners, privacy reviewers, support teams, and selected pilot users',
    'Validate that team-level memory controls are understandable, auditable, and support-ready before broader enterprise rollout.',
    'High'
  );

--------------------------------------------------------------------------------
-- ADD LAUNCH 1 EXTRA CLUSTERS
-- Launch 1 already exists from 002_seed_data.sql:
-- Enterprise Knowledge Connector Beta
--------------------------------------------------------------------------------

INSERT INTO feedback_clusters (
  cluster_id,
  launch_id,
  cluster_name,
  category,
  subcategory,
  issue_type,
  suggested_owner_team_id,
  priority_signal
)
VALUES
  (
    5,
    1,
    'Security approval confusion',
    'Security Review',
    'Approval process clarity',
    'Launch readiness gap',
    7,
    'Security reviewers are unclear on what must be approved before enterprise connector rollout.'
  ),
  (
    6,
    1,
    'Workspace role mismatch',
    'Permissions',
    'Workspace role behavior',
    'Configuration issue',
    1,
    'Admins report role behavior that does not match expected connector setup permissions.'
  );

--------------------------------------------------------------------------------
-- ADD LAUNCH 2 CLUSTERS
-- Admin Analytics Dashboard Rollout
--------------------------------------------------------------------------------

INSERT INTO feedback_clusters (
  cluster_id,
  launch_id,
  cluster_name,
  category,
  subcategory,
  issue_type,
  suggested_owner_team_id,
  priority_signal
)
VALUES
  (
    7,
    2,
    'Dashboard data freshness delay',
    'Analytics',
    'Data freshness',
    'Trust / reliability issue',
    2,
    'Admins are reporting delays between actual usage activity and dashboard updates, reducing trust in rollout metrics.'
  ),
  (
    8,
    2,
    'Admin metric definitions unclear',
    'Analytics',
    'Metric definition clarity',
    'Usability / comprehension issue',
    1,
    'Admins and customer success teams need clearer definitions for adoption, active users, usage, and engagement metrics.'
  ),
  (
    9,
    2,
    'Export CSV formatting issues',
    'Reporting',
    'CSV export quality',
    'Workflow friction',
    2,
    'Exported reports contain formatting issues that create manual cleanup work for customer operations teams.'
  ),
  (
    10,
    2,
    'Role-based analytics access confusion',
    'Permissions',
    'Analytics access controls',
    'Access model clarity issue',
    1,
    'Admins are unclear which roles can view, export, or manage analytics dashboards.'
  ),
  (
    11,
    2,
    'Partner reporting enablement gaps',
    'Partner Enablement',
    'Reporting training readiness',
    'Launch readiness gap',
    4,
    'Partner success teams need clearer reporting guidance before supporting enterprise dashboard questions.'
  ),
  (
    12,
    2,
    'Billing usage metric mismatch',
    'Billing',
    'Usage metric reconciliation',
    'Data consistency issue',
    5,
    'Customers are comparing dashboard usage metrics with billing-related usage and finding mismatches that need explanation.'
  );

--------------------------------------------------------------------------------
-- ADD LAUNCH 3 CLUSTERS
-- Team Memory Controls Pilot
--------------------------------------------------------------------------------

INSERT INTO feedback_clusters (
  cluster_id,
  launch_id,
  cluster_name,
  category,
  subcategory,
  issue_type,
  suggested_owner_team_id,
  priority_signal
)
VALUES
  (
    13,
    3,
    'Memory toggle behavior unclear',
    'Memory Controls',
    'User-facing control clarity',
    'Usability / comprehension issue',
    1,
    'Pilot users and admins are unsure what the memory toggle changes and when the setting takes effect.'
  ),
  (
    14,
    3,
    'Admin control propagation delay',
    'Admin Controls',
    'Policy propagation timing',
    'Trust / reliability issue',
    2,
    'Admins report delays between changing a team memory setting and seeing the expected behavior across the workspace.'
  ),
  (
    15,
    3,
    'Privacy review questions',
    'Policy / Safety',
    'Privacy review readiness',
    'Launch readiness gap',
    7,
    'Privacy reviewers need clearer answers about memory retention, visibility, consent, and admin controls before pilot expansion.'
  ),
  (
    16,
    3,
    'User consent language confusion',
    'Policy / Safety',
    'Consent language clarity',
    'Usability / comprehension issue',
    7,
    'Users are unsure what they are agreeing to when team memory controls are enabled or changed.'
  ),
  (
    17,
    3,
    'Support macro gaps',
    'Support Readiness',
    'Support response coverage',
    'Support readiness gap',
    1,
    'Support teams lack prepared macros for common memory control questions during the pilot.'
  ),
  (
    18,
    3,
    'Cross-workspace memory misunderstanding',
    'Memory Controls',
    'Workspace boundary clarity',
    'Trust / comprehension issue',
    1,
    'Users and admins are confused about whether team memory applies across workspaces, teams, or only the current workspace.'
  );

--------------------------------------------------------------------------------
-- OPTIONAL VALIDATION QUERIES
-- Run these manually after the INSERT statements if you want to confirm setup.
--------------------------------------------------------------------------------

-- Expected launch count after running this file: 3
SELECT
  COUNT(*) AS launch_count
FROM launches;

-- Expected cluster count after running this file: 18
-- 4 starter clusters from 002_seed_data.sql
-- + 2 additional Launch 1 clusters
-- + 6 Launch 2 clusters
-- + 6 Launch 3 clusters
SELECT
  COUNT(*) AS cluster_count
FROM feedback_clusters;

-- Show all launches
SELECT
  launch_id,
  launch_name,
  launch_date,
  launch_phase,
  support_risk_level
FROM launches
ORDER BY launch_id;

-- Show all clusters by launch
SELECT
  fc.launch_id,
  l.launch_name,
  fc.cluster_id,
  fc.cluster_name,
  fc.category,
  fc.subcategory,
  fc.issue_type
FROM feedback_clusters fc
JOIN launches l
  ON fc.launch_id = l.launch_id
ORDER BY fc.launch_id, fc.cluster_id;