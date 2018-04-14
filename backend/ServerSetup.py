from flask import Flask
from flask import request
from backend.MakeGroups import handleInput
from backend.Calculator import *

app = Flask(__name__)

@app.route("/", methods=['GET','POST', 'OPTIONS'])
def begin():
    data = request.data
    data = data.decode("utf-8")
    if(len(data) == 4):
        calculate(data)
    else:
        handleInput(data)
    return "OK"


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

if __name__ == "__main__":
    app.run(debug=True)




