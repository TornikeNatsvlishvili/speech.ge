import os
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
from werkzeug import secure_filename

app = Flask(__name__, static_url_path='')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 MB

app.config['UPLOAD_FOLDER'] = 'uploads/'

def allowed_file(filename):
    return True
    # return '.' in filename and \
    #        filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    sentence = request.form['sentence']
    if file and sentence:
        # filename = secure_filename(sentence)
        filename = sentence
        fullpath = os.path.join(os.path.dirname(__file__), app.config['UPLOAD_FOLDER'], '{}.opus'.format(filename))
        count = 1
        while os.path.isfile(fullpath):
            fullpath = os.path.join(os.path.dirname(__file__), app.config['UPLOAD_FOLDER'], '{}.{}.opus'.format(filename, count))
            count += 1
        file.save(fullpath)
        return jsonify({'status': 'success'})

    return jsonify({'status': 'error'})