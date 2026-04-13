from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = os.urandom(24) # Llave aleatoria para seguridad

def get_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Inicialización de la base de datos
def init_db():
    with get_db() as db:
        db.execute('''CREATE TABLE IF NOT EXISTS users 
                      (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)''')
        db.execute('''CREATE TABLE IF NOT EXISTS tasks 
                      (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, content TEXT, status INTEGER)''')
        db.commit()

init_db()

@app.route('/')
def home():
    if 'user_id' in session:
        return render_template('index.html', username=session['username'])
    return render_template('login.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_pw = generate_password_hash(data['password'])
    try:
        db = get_db()
        db.execute('INSERT INTO users (username, password) VALUES (?, ?)', (data['username'], hashed_pw))
        db.commit()
        return jsonify({"msg": "Registrado con éxito"}), 201
    except:
        return jsonify({"msg": "El usuario ya existe"}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    db = get_db()
    user = db.execute('SELECT * FROM users WHERE username = ?', (data['username'],)).fetchone()
    if user and check_password_hash(user['password'], data['password']):
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({"msg": "Login exitoso"}), 200
    return jsonify({"msg": "Credenciales inválidas"}), 401

@app.route('/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if 'user_id' not in session: return jsonify([]), 401
    db = get_db()
    if request.method == 'POST':
        db.execute('INSERT INTO tasks (user_id, content
