from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, json, Response
from backend.Calculator import *
import backend.Calculator
from backend.Input import handleInput
import time


app = Flask(__name__)
app.secret_key = 'kryptogutta'


@app.route("/", methods=['GET', 'POST'])
def begin():

    return render_template("index.html")


@app.route("/result", methods=['GET', 'POST'])
def calculate_result():
    start = time.time()
    print("STARTER å kalkulere resultat: " + str(start))

    data = request.get_data()

    global trans
    result = calculate(data, trans)

    print("FERDIG å kalkulere resultat: " + str(time.time()) + "\nDet tok: " + str(time.time() - start))

    return jsonify(result = result)

trans = []


@app.route("/newInput", methods=['GET', 'POST'])
def new_input():

    start = time.time()
    print("STARTER å håndtere trans: " + str(start))

    data = request.data
    data = data.decode("utf-8")

    global trans
    trans = handleInput(data)

    print ("FERDIG å håndtere trans: " + str(time.time()) + "\nDet tok: " + str(time.time() - start))

    return ""

if __name__ == "__main__":
    app.run(debug=True)
