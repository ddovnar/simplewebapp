import logging
import sqlite3
import os.path
from flask import g, Flask, jsonify, request, render_template
from flask_cors import CORS

logging.basicConfig(level=logging.DEBUG)

DATABASE = './db/data.db'

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000" "*"}})

def make_dicts(cursor, row):
    return dict((cursor.description[idx][0], value) for idx, value in enumerate(row))

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        logging.debug('connect to db')
        db = g._database = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/user', methods=['GET'])
def list_user():
    data = []
    users = query_db('select * from app_user')
    for user in users:
        data.append(dict(user))
    return jsonify(data)

@app.route('/api/user/<login>', methods=['GET'])
def get_user_by_login(login):
    user = query_db('select * from app_user where login = ?', [login], one=True)
    if user is None:
        return jsonify({})
    return jsonify(dict(user))


@app.route('/api/bank', methods=['GET'])
def list_bank():
    data = []
    banks = query_db('select * from app_bank')
    for bank in banks:
        data.append(dict(bank))
    return jsonify(data)

@app.route('/api/bank/<id>', methods=['GET'])
def get_bank_by_id(id):
    bank = query_db('select * from app_bank where id = ?', [id], one=True)
    if bank is None:
        return jsonify({})
    return jsonify(dict(bank))

def prepare_data(data):
    if data['interest_rate'] == '':
        data['interest_rate'] = 0
    if data['loan_term'] == '':
        data['loan_term'] = 0
    if data['max_loan'] == '':
        data['max_loan'] = 0
    if data['min_down_payment'] == '':
        data['min_down_payment'] = 0

@app.route('/api/bank', methods=['POST'])
def save_bank():
    data = request.json
    prepare_data(data)
    db = None
    try:
        bank = None
        if data['id'] > 0:
            bank = query_db('select * from app_bank where id = ?', [data['id']], one=True)
        if bank is None:
            db = get_db()
            cur = db.execute('insert into app_bank(interest_rate, loan_term, max_loan, min_down_payment, name) ' +
                'values(?,?,?,?,?)',
                (data['interest_rate'], data['loan_term'], data['max_loan'], data['min_down_payment'], data['name']))
        else:
            db = get_db()
            cur = db.execute('update app_bank set interest_rate=?, loan_term=?, max_loan=?, min_down_payment=?, name=? ' +
                ' where id = ?',
                (data['interest_rate'], data['loan_term'], data['max_loan'], data['min_down_payment'], data['name'], bank['id']))
        db.commit()
        return jsonify({'status': 0, 'id': cur.lastrowid})
    except Exception as ex:
        return jsonify({'status': -1})
    finally:
        if db is not None:
            db.close()

@app.route('/api/bank/<id>', methods=['DELETE'])
def remove_bank(id):
    db = None
    try:
        db = get_db()
        cur = db.execute('delete from app_bank where id = ?', (id,))
        db.commit()
        return jsonify({'status': 0})
    except Exception as ex:
        return jsonify({'status': -1})
    finally:
        if db is not None:
            db.close()

def init_db():
    if not os.path.exists('./db/data.db'):
        logging.debug('init_db')
        with app.app_context():
            logging.debug('process context')
            db = get_db()
            with app.open_resource('./db/schema.sql', mode='r') as f:
                db.cursor().executescript(f.read())

if __name__ == '__main__':
    logging.debug('start server')
    init_db()
    app.run(host='0.0.0.0', port=5020, debug=True)