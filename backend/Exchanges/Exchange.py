from dateutil import parser
import pickle

class Exchange:

    def __init__(self, data):
        self.trans = self.save_transactions(data)

    def save_transactions(self, data):
        return

    def create_date(self, date_string):
        return parser.parse(date_string)
