from datetime import datetime

date1 = "01/08/2018 08:35"
date2 = "12/19/2017 1:52:47 PM"
date3 = "12/17/2017 9:57:56 AM"
date4 = "9/16/2017 4:45:54 PM"

def create_date(date_string):
    try:
        return datetime.strptime(date_string, "%m/%d/%Y %I:%M:%S %p")
    except ValueError:
        return datetime.strptime(date_string, "%m/%d/%Y %H:%M")

print(create_date(date4))
