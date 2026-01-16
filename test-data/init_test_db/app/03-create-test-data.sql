# guest user
INSERT INTO core.guest
    (active, "name", qr_code_token, is_admin)
VALUES (true, 'Test User', 'test-user', false);

# task templates
INSERT INTO task_template
(id, active, description, title)
VALUES(1, true, 'Take a Photo', 'Photo Task');
INSERT INTO task_template
(id, active, description, title)
VALUES(2, true, 'Take a Video', 'Video Task');

# task for guest user
INSERT INTO task
(id, completed, guest_id, task_template_id, upload_id)
VALUES(1, false, 1, 1, NULL);