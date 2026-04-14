from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = os.urandom(24) # Llave aleatoria para seguridad

def get_db():
    conn = sqlite3.connect('usuarios_tareas.db')
    conn.row_factory = sqlite3.Row
    return conn

# Crear tablas
with get_db() as db:
    db.execute('''CREATE TABLE IF NOT EXISTS users 
                  (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)''')
    db.execute('''CREATE TABLE IF NOT EXISTS tasks 
                  (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, content TEXT, status INTEGER)''')

@app.route('/')
def home():
    if 'user_id' in session:
        return render_template('index.html', user=session['username'])
    return render_template('login.html')

@app.route('/auth', methods=['POST'])
def auth():
    data = request.json
    action = data.get('action')
    db = get_db()
    
    if action == 'register':
        try:
            hashed_pw = generate_password_hash(data['password'])
            db.execute('INSERT INTO users (username, password) VALUES (?, ?)', (data['username'], hashed_pw))
            db.commit()
            return jsonify({"msg": "Usuario creado"}), 201
        except:
            return jsonify({"msg": "Error: El usuario ya existe"}), 400
            
    elif action == 'login':
        user = db.execute('SELECT * FROM users WHERE username = ?', (data['username'],)).fetchone()
        if user and check_password_hash(user['password'], data['password']):
            session['user_id'] = user['id']
            session['username'] = user['username']
            return jsonify({"msg": "Bienvenido"}), 200
        return jsonify({"msg": "Credenciales incorrectas"}), 401

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

@app.route('/tasks', methods=['GET', 'POST'])
def tasks():
    if 'user_id' not in session: return jsonify([]), 401
    db = get_db()
    if request.method == 'POST':
        db.execute('INSERT INTO tasks (user_id, content, status) VALUES (?, ?, 0)', 
                   (session['user_id'], request.json['content']))
        db.commit()
        return jsonify({"status": "ok"})
    
    res = db.execute('SELECT * FROM tasks WHERE user_id = ?', (session['user_id'],)).fetchall()
    return jsonify([dict(row) for row in res])

if __name__ == '__main__':
    app.run(debug=True)
        #/#\#
       #/###\#
      #/Mathi\#
     #/Mathias\#
    #/MathiasSc\#
 #/#/MathiasSci|\#\#
#/#/32-bits-or-64\#\#
