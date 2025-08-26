-- User creation
CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'app_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON appdb.* TO 'app_user'@'%';

CREATE USER IF NOT EXISTS 'bgw_user'@'%' IDENTIFIED BY 'bgw_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON appdb.* TO 'bgw_user'@'%';

CREATE USER IF NOT EXISTS 'mig_user'@'%' IDENTIFIED BY 'mig_password';
GRANT ALL PRIVILEGES ON appdb.* TO 'mig_user'@'%';

FLUSH PRIVILEGES;