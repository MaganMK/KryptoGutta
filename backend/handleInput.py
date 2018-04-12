
from flask import Flask
app = Flask(__name__)

@app.route("../backend/handleInput", method=['POST'])

def handleInput():
    fileWriter = open("../transactions/test.txt", 'a')
    fileWriter.write("JAAAAA FOR FAEN\n")
    fileWriter.close()


if __name__ == "__main__":
    app.run(debug=True)



