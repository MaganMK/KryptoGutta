

def handleInput(data):
    data = data.decode("utf-8")
    fileWriter = open("../transactions/test.txt", 'a')
    print(data)
    fileWriter.write(data)
    fileWriter.close()