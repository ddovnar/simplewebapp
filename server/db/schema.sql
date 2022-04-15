CREATE TABLE app_user (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
, login TEXT(100) NOT NULL, password TEXT(255) NOT NULL);

CREATE UNIQUE INDEX app_user_id_IDX ON app_user (id);
CREATE UNIQUE INDEX app_user_login_IDX ON app_user (login);


CREATE TABLE app_bank (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name TEXT(255) NOT NULL,
	interest_rate INTEGER DEFAULT 0,
	max_loan INTEGER DEFAULT 0,
	min_down_payment INTEGER DEFAULT 0,
	loan_term INTEGER DEFAULT 0
);

CREATE UNIQUE INDEX app_bank_id_IDX ON app_bank (id);
CREATE UNIQUE INDEX app_bank_name_IDX ON app_bank (name);

INSERT INTO app_bank
(name, interest_rate, max_loan, min_down_payment, loan_term)
VALUES('BankA', 10, 50000, 200, 12);
