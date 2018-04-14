from datetime import datetime

def create_date(date_string):
    try:
        return datetime.strptime(date_string, "%m/%d/%Y %I:%M:%S %p")
    except ValueError:
        try:
            return datetime.strptime(date_string, "%m/%d/%Y %H:%M")
        except:
            return datetime.strptime(date_string, "%m/%d/%Y %H:%M")


print(create_date("01/08/2018 08:35"))
