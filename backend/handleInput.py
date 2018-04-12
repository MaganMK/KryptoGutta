
from flask import Flask

app = Flask(__name__)

@app.route("/", methods=['POST', 'OPTIONS'])

def handleInput():
    print("GOOOO")
    fileWriter = open("../transactions/test.txt", 'a')
    fileWriter.write("JAAAAA FOR FAEN\n")
    fileWriter.close()
    return "OK"

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

if __name__ == "__main__":
    app.run(debug=True)




