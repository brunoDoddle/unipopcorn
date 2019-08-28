#! /usr/bin/python
# -*- coding:utf-8 -*-
import os
import logging
from flask import Flask, request, render_template, redirect, url_for

project_root = os.path.dirname(os.path.realpath('__file__'))    # la racine du projet est le répertoire courant
template_path = os.path.join(project_root, 'templates')         # les templates
static_path = os.path.join(project_root, 'public')              # Les trucs static (css/image/...)

# Attention les routes se définissent sur app (objet flask)
app = Flask(__name__, template_folder=template_path, static_folder=static_path)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Pas de cache pour les fichiers statiques

@app.route('/')
def index():
    logging.info("Demarrage")
    return render_template('index.html')

if __name__ == "__main__":
    app.run()
