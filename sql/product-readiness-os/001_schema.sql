PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS routed_tasks;
DROP TABLE IF EXISTS feedback_records;
DROP TABLE IF EXISTS feedback_clusters;
DROP TABLE IF EXISTS readiness_items;
DROP TABLE IF EXISTS risks;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS launches;

CREATE TABLE launches (
  launch_id INTEGER PRIMARY KEY,
  launch_name TEXT NOT NULL,
  launch_date TEXT NOT NULL,
  launch_phase TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  main_goal TEXT NOT NULL,
  support_risk_level TEXT NOT NULL
);

CREATE TABLE teams (
  team_id INTEGER PRIMARY KEY,
  team_name TEXT NOT NULL UNIQUE,
  team_type TEXT NOT NULL
);

CREATE TABLE feedback_clusters (
  cluster_id INTEGER PRIMARY KEY,
  cluster_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  subcategory TEXT,
  issue_type TEXT,
  suggested_owner_team_id INTEGER,
  priority_signal TEXT,
  FOREIGN KEY (suggested_owner_team_id) REFERENCES teams(team_id)
);

CREATE TABLE feedback_records (
  feedback_id TEXT PRIMARY KEY,
  launch_id INTEGER NOT NULL,
  cluster_id INTEGER,
  source_channel TEXT NOT NULL,
  customer_segment TEXT NOT NULL,
  feedback_text TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  severity TEXT NOT NULL,
  status TEXT NOT NULL,
  confidence_score INTEGER,
  confidence_level TEXT,
  human_review_needed TEXT NOT NULL,
  likely_owner TEXT NOT NULL,
  recommended_route TEXT NOT NULL,
  created_at TEXT NOT NULL,
  ingested_at TEXT NOT NULL,
  FOREIGN KEY (launch_id) REFERENCES launches(launch_id),
  FOREIGN KEY (cluster_id) REFERENCES feedback_clusters(cluster_id)
);

CREATE TABLE routed_tasks (
  task_id INTEGER PRIMARY KEY,
  launch_id INTEGER NOT NULL,
  cluster_id INTEGER NOT NULL,
  task_title TEXT NOT NULL,
  department TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  source_signal TEXT,
  total_reports INTEGER DEFAULT 0,
  severe_impact_count INTEGER DEFAULT 0,
  trend TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (launch_id) REFERENCES launches(launch_id),
  FOREIGN KEY (cluster_id) REFERENCES feedback_clusters(cluster_id)
);

CREATE TABLE readiness_items (
  readiness_item_id INTEGER PRIMARY KEY,
  launch_id INTEGER NOT NULL,
  workstream TEXT NOT NULL,
  item_label TEXT NOT NULL,
  status TEXT NOT NULL,
  owner TEXT NOT NULL,
  due_date TEXT,
  notes TEXT,
  FOREIGN KEY (launch_id) REFERENCES launches(launch_id)
);

CREATE TABLE risks (
  risk_id INTEGER PRIMARY KEY,
  launch_id INTEGER NOT NULL,
  risk_title TEXT NOT NULL,
  severity TEXT NOT NULL,
  affected_audience TEXT NOT NULL,
  owner TEXT NOT NULL,
  mitigation_plan TEXT NOT NULL,
  status TEXT NOT NULL,
  escalation_path TEXT,
  FOREIGN KEY (launch_id) REFERENCES launches(launch_id)
);