

def handleInput(data):
    data = data.decode("utf-8")
    fileWriter = open("../backend/test.txt", 'w')
    print(data)
    fileWriter.write("100 kr")
    fileWriter.close()