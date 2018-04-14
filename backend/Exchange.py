from dateutil import parser
import pickle

class Exchange:

    def __init__(self, data):
        self.save_transactions(data)

    def save_transactions(self, data):
        return

    def create_date(self, date_string):
        return parser.parse(date_string)

    def write_result(self, transactions):
        with open("../backend/test.txt", "wb") as f:
            for tx in transactions:
                pickle.dump(tx, f)
