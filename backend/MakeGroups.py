

def handleInput(data):
    data = data.decode("utf-8")
    fileWriter = open("../backend/test.txt", 'w')
    fileWriter.write("1000 kr")
    fileWriter.close()