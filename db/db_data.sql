-- Insert roles
INSERT INTO roles (name)
VALUES 
  ('Manager'),
  ('Developer'),
  ('Designer'),
  ('QA Engineer'),
  ('Product Owner');

-- Insert team members
CREATE OR REPLACE PROCEDURE addTeamMember(name VARCHAR(255), email VARCHAR(255), active BOOLEAN) AS
$$
    INSERT INTO team_members (name, email, active, avatar_url) VALUES (name, email, active, 'https://i.pravatar.cc/120?u=' || email)
$$
  LANGUAGE SQL;

  CALL addTeamMember('Alice Johnson', 'alice@example.com', TRUE);
  CALL addTeamMember('Bob Smith', 'bob@example.com', TRUE);
  CALL addTeamMember('Carol White', 'carol@example.com', TRUE);
  CALL addTeamMember('David Brown', 'david@example.com', FALSE);
  CALL addTeamMember('Emily Davis', 'emily@example.com', TRUE);
  CALL addTeamMember('Frank Thomas', 'frank@example.com', TRUE);
  CALL addTeamMember('Grace Kelly', 'grace@example.com', TRUE);
  CALL addTeamMember('Hank Green', 'hank@example.com', FALSE);
  CALL addTeamMember('Ivy Moore', 'ivy@example.com', TRUE);
  CALL addTeamMember('Jack Turner', 'jack@example.com', TRUE);
  CALL addTeamMember('Karen Taylor', 'karen@example.com', FALSE);
  CALL addTeamMember('Larry Scott', 'larry@example.com', TRUE);
  CALL addTeamMember('Monica Wright', 'monica@example.com', TRUE);
  CALL addTeamMember('Nathan King', 'nathan@example.com', TRUE);
  CALL addTeamMember('Olivia Carter', 'olivia@example.com', TRUE);
  CALL addTeamMember('Paul Walker', 'paul@example.com', FALSE);
  CALL addTeamMember('Quinn Parker', 'quinn@example.com', TRUE);
  CALL addTeamMember('Rachel Adams', 'rachel@example.com', TRUE);
  CALL addTeamMember('Sam Peterson', 'sam@example.com', FALSE);
  CALL addTeamMember('Tina Harris', 'tina@example.com', TRUE);
  CALL addTeamMember('Uma Bennett', 'uma@example.com', TRUE);
  CALL addTeamMember('Victor Evans', 'victor@example.com', TRUE);
  CALL addTeamMember('Wendy Hughes', 'wendy@example.com', FALSE);
  CALL addTeamMember('Xander Hall', 'xander@example.com', TRUE);
  CALL addTeamMember('Yvonne Lewis', 'yvonne@example.com', TRUE);
  CALL addTeamMember('Zachary Clark', 'zachary@example.com', FALSE);
  CALL addTeamMember('Mr. X', 'ceo@example.com', TRUE);

-- Insert teams
INSERT INTO teams (name, parent_team_id, metadata)
VALUES 
  ('CEO', NULL, '{"department": "C-Level"}'),
  ('Engineering', 1, '{"department": "Product Development"}'),
  ('Design', 2, '{"department": "Creative Services"}'),
  ('QA', 2, '{"department": "Quality Assurance"}'),
  ('Backend Team', 2, '{"focus": "Backend Development"}'),
  ('Frontend Team', 2, '{"focus": "Frontend Development"}'),
  ('Sales', 1, '{"department": "Sales & marketing"}'),
  ('Marketing', 7, '{"department": "Marketing specialists"}');

-- Assign team memberships
INSERT INTO team_memberships (team_id, member_id, role_id)
VALUES 
  (2, 1, 1), -- Alice Johnson in Engineering as Manager
  (3, 2, 2), -- Bob Smith in Design as Developer
  (4, 3, 3), -- Carol White in QA as Designer
  (5, 4, 4), -- David Brown in Backend Team as QA Engineer
  (6, 5, 5), -- Emily Davis in Frontend Team as Product Owner
  (2, 6, 2), -- Frank Thomas in Engineering as Developer
  (3, 7, 3), -- Grace Kelly in Design as Designer
  (4, 8, 4), -- Hank Green in QA as QA Engineer
  (5, 9, 2), -- Ivy Moore in Backend Team as Developer
  (6, 10, 3), -- Jack Turner in Frontend Team as Designer
  (7, 11, 1), -- Karen Taylor in Sales as Manager
  (8, 12, 5), -- Larry Scott in Marketing as Product Owner
  (7, 13, 3), -- Monica Wright in Sales as Designer
  (8, 14, 4), -- Nathan King in Marketing as QA Engineer
  (2, 15, 2), -- Olivia Carter in Engineering as Developer
  (5, 16, 4), -- Paul Walker in Backend Team as QA Engineer
  (6, 17, 3), -- Quinn Parker in Frontend Team as Designer
  (3, 18, 5), -- Rachel Adams in Design as Product Owner
  (7, 19, 1), -- Sam Peterson in Sales as Manager
  (8, 20, 4), -- Tina Harris in Marketing as QA Engineer
  (5, 21, 2), -- Uma Bennett in Backend Team as Developer
  (6, 22, 3), -- Victor Evans in Frontend Team as Designer
  (2, 23, 1), -- Wendy Hughes in Engineering as Manager
  (3, 24, 2), -- Xander Hall in Design as Developer
  (4, 25, 3), -- Yvonne Lewis in QA as Designer
  (7, 26, 5), -- Zachary Clark in Sales as Product Owner
  (1, 27, 1); -- Mr. X is the CEO
