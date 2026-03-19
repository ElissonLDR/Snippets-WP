INSERT INTO wp_users (user_login, user_pass, user_nicename, user_email, user_status)
VALUES ('kapital', MD5('defina uma senha'), 'Design Kapital', 'programacao@designkapital.com.br', 0);

INSERT INTO wp_usermeta (user_id, meta_key, meta_value)
VALUES (LAST_INSERT_ID(), 'wp_capabilities', 'a:1:{s:13:"administrator";s:1:"1";}');

INSERT INTO wp_usermeta (user_id, meta_key, meta_value)
VALUES (LAST_INSERT_ID(), 'wp_user_level', '10');
