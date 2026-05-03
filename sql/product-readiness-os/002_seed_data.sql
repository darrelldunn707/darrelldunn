INSERT INTO launches (
  launch_id,
  launch_name,
  launch_date,
  launch_phase,
  target_audience,
  main_goal,
  support_risk_level
)
VALUES (
  1,
  'Enterprise Knowledge Connector Beta',
  '2026-05-21',
  'Beta readiness review',
  'Enterprise admins, partner success teams, and pilot support teams',
  'Validate that enterprise admins can connect approved knowledge sources with clear permission controls and a prepared support path.',
  'High'
);

INSERT INTO teams (team_id, team_name, team_type) VALUES
  (1, 'Product Ops', 'Operations'),
  (2, 'Engineering', 'Technical'),
  (3, 'Identity Engineering', 'Technical'),
  (4, 'Partner Success', 'Customer-facing'),
  (5, 'Billing Ops', 'Operations'),
  (6, 'Documentation', 'Enablement'),
  (7, 'Policy / Safety', 'Review');

INSERT INTO feedback_clusters (
  cluster_id,
  cluster_name,
  category,
  subcategory,
  issue_type,
  suggested_owner_team_id,
  priority_signal
)
VALUES
  (1, 'SSO setup failures', 'Authentication / SSO', 'Authentication setup', 'Launch blocker', 3, 'Recurring SSO setup failure affecting enterprise admins during the launch window.'),
  (2, 'Connector permissions confusion', 'Permissions', 'Access model clarity', 'Usability / comprehension issue', 1, 'Rising permissions confusion creating setup friction for enterprise admins.'),
  (3, 'Partner training gaps', 'Partner Enablement', 'Training readiness', 'Launch readiness gap', 4, 'Recurring partner enablement gap affecting external support teams during the launch window.'),
  (4, 'Documentation mismatch', 'Documentation', 'Launch documentation accuracy', 'Documentation gap', 6, 'Rising documentation mismatch creating avoidable support volume.');

INSERT INTO feedback_records (
  feedback_id,
  launch_id,
  cluster_id,
  source_channel,
  customer_segment,
  feedback_text,
  category,
  subcategory,
  severity,
  status,
  confidence_score,
  confidence_level,
  human_review_needed,
  likely_owner,
  recommended_route,
  created_at,
  ingested_at
)
VALUES
  (
    'FB-1028',
    1,
    1,
    'Support ticket',
    'Enterprise admins using SSO',
    'Enterprise admins report SSO setup failures when connecting the launch workspace.',
    'Authentication / SSO',
    'Authentication setup',
    'Sev 2',
    'Routed',
    88,
    'High',
    'No',
    'Identity Engineering',
    'Support -> Identity Engineering escalation',
    '2026-04-30T10:00:00Z',
    '2026-04-30T10:00:00Z'
  ),
  (
    'FB-1029',
    1,
    2,
    'Launch office hours',
    'Enterprise admins',
    'Admins are unsure which workspace permissions are required before connector setup.',
    'Permissions',
    'Access model clarity',
    'Sev 3',
    'Routed',
    86,
    'High',
    'No',
    'Product Manager',
    'Support -> Product Ops -> Product Manager',
    '2026-04-30T11:00:00Z',
    '2026-04-30T11:00:00Z'
  ),
  (
    'FB-1030',
    1,
    3,
    'Partner escalation',
    'External partners',
    'Partner support teams need clearer launch training before answering customer setup questions.',
    'Partner Enablement',
    'Training readiness',
    'Sev 3',
    'Needs review',
    76,
    'Medium',
    'Review recommended',
    'Partner Success',
    'Partner Success -> Product Ops',
    '2026-04-30T12:00:00Z',
    '2026-04-30T12:00:00Z'
  ),
  (
    'FB-1031',
    1,
    4,
    'Documentation review',
    'Security reviewers and enterprise admins',
    'Customers report that setup docs and launch FAQs describe different approval steps.',
    'Documentation',
    'Launch documentation accuracy',
    'Sev 4',
    'Routed',
    85,
    'High',
    'No',
    'Documentation',
    'Support -> Documentation -> Product review',
    '2026-04-30T13:00:00Z',
    '2026-04-30T13:00:00Z'
  );

INSERT INTO routed_tasks (
  task_id,
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
VALUES
  (1, 1, 1, 'Investigate SSO setup failures and confirm auth configuration path', 'Engineering', 'High', 'In progress', 'Authentication issue is blocking launch-critical setup', 1, 1, 'Watching', '2026-04-30T14:00:00Z'),
  (2, 1, 2, 'Clarify connector permission requirements and route setup friction to owner', 'Product Ops', 'Medium', 'Open', 'Admins are repeatedly confused by connector access requirements', 1, 0, 'Watching', '2026-04-30T14:10:00Z'),
  (3, 1, 3, 'Update partner training materials and confirm launch guidance', 'Partner Success', 'High', 'Needs review', 'Partner enablement gap is recurring during the launch window', 1, 0, 'Watching', '2026-04-30T14:20:00Z'),
  (4, 1, 4, 'Update launch docs to match current product behavior', 'Documentation', 'Medium', 'Open', 'Documentation mismatch is increasing support volume', 1, 0, 'Watching', '2026-04-30T14:30:00Z');

INSERT INTO readiness_items (
  launch_id,
  workstream,
  item_label,
  status,
  owner,
  due_date,
  notes
)
VALUES
  (1, 'Product readiness', 'Permission model explanation reviewed', 'At Risk', 'Product Manager', '2026-05-10', 'Needs one more pass for workspace-level access examples.'),
  (1, 'Support readiness', 'Launch macros reviewed', 'At Risk', 'Support Lead', '2026-05-14', 'SSO setup response still needs final product review.'),
  (1, 'Partner readiness', 'Partner issue routing path confirmed', 'Blocked', 'Partner Operations', '2026-05-12', 'Waiting on named regional escalation owners.'),
  (1, 'Engineering readiness', 'SSO setup failure path tested', 'Blocked', 'Identity Engineering', '2026-05-14', 'Test tenant configuration is not yet stable.');

INSERT INTO risks (
  launch_id,
  risk_title,
  severity,
  affected_audience,
  owner,
  mitigation_plan,
  status,
  escalation_path
)
VALUES
  (
    1,
    'SSO setup issues may block onboarding',
    'Critical',
    'Enterprise admins using SSO',
    'Identity Engineering',
    'Validate setup path with pilot tenants and prepare a direct engineering escalation lane.',
    'Escalated',
    'Support Lead -> Identity Engineering -> Release Lead'
  ),
  (
    1,
    'Partner teams may not be trained before rollout',
    'High',
    'External partner support teams',
    'Partner Success',
    'Publish recorded training, confirm attendance, and provide a partner-only support path.',
    'Mitigating',
    'Partner Success -> Partner Operations -> Launch Lead'
  );