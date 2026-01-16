-- guest user
INSERT INTO guest
    (active, "name", qr_code_token, is_admin)
VALUES (true, 'Test User', 'test-user', false);

-- task templates
INSERT INTO task_template
    (id, active, description, title)
VALUES (1, true, 'Take a Photo', 'Photo Task');
INSERT INTO task_template
    (id, active, description, title)
VALUES (2, true, 'Take a Video', 'Video Task');

-- task for guest user
INSERT INTO task
    (id, completed, guest_id, task_template_id, upload_id)
VALUES (1, false, 1, 1, NULL);

-- event location
INSERT INTO event_location
    (id, routes_address, unsafe_map_url)
VALUES (1, 'Ruhrtalstraße 111, 45239 Essen',
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2485.123456789!2d7.0789123!3d51.3876543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8c5a6b7c8d9e0%3A0x1234567890abcdef!2sRuhrtalstra%C3%9Fe%20111%2C%2045239%20Essen!5e1!3m2!1sde!2sde!4v1234567890123!5m2!1sde!2sde refactor link to ');

-- address lines for event location
INSERT INTO address_line
    (id, order_index, "text", event_location_id)
VALUES (1, 0, '12 Apostel am Staadt Essen', 1);
INSERT INTO address_line
    (id, order_index, "text", event_location_id)
VALUES (2, 1, 'Ruhrtalstraße 111', 1);
INSERT INTO address_line
    (id, order_index, "text", event_location_id)
VALUES (3, 2, '45239 Essen', 1);
INSERT INTO address_line
    (id, order_index, "text", event_location_id)
VALUES (4, 3, 'Deutschland', 1);

-- schedule items
INSERT INTO schedule_item
    (id, "name", order_index, "time")
VALUES (1, 'Beginn', 0, '14:30');
INSERT INTO schedule_item
    (id, "name", order_index, "time")
VALUES (2, 'Ende', 1, '15:00');

-- menu items
INSERT INTO menu_item
(id, category, description, "name", order_index)
VALUES(1, 0, 'Ein Salat', 'Salat', 0);
INSERT INTO menu_item
(id, category, description, "name", order_index)
VALUES(2, 0, 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.a', 'KP', 1);
INSERT INTO menu_item
(id, category, description, "name", order_index)
VALUES(3, 1, 'vom Tier', 'Fleisch', 2);
INSERT INTO menu_item
(id, category, description, "name", order_index)
VALUES(4, 1, 'aus dem Wasser', 'Fisch', 3);
INSERT INTO menu_item
(id, category, description, "name", order_index)
VALUES(5, 2, 'ist kalt', 'Eis', 4);
INSERT INTO menu_item
(id, category, description, "name", order_index)
VALUES(6, 2, 'ist warm', 'Pfannkuchen', 5);
INSERT INTO menu_item
(id, category, description, "name", order_index)
VALUES(7, 3, 'vom Fass, bestimmt aus dem Sauerland', 'Bier', 9);
INSERT INTO menu_item
(id, category, description, "name", order_index)
VALUES(8, 3, 'roter Wein', 'Rotwein', 7);
INSERT INTO menu_item
(id, category, description, "name", order_index)
VALUES(9, 3, 'weisser Wein', 'Weisswein', 8);
INSERT INTO menu_item
(id, category, description, "name", order_index)
VALUES(10, 3, 'ist Jesus mal drüber gelaufen', 'Wasser', 5);