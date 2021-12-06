import json
import csv

with open('statementLines.json') as json_file:
    data = json.load(json_file)
    header = ['accountNumber', 'lender', 'name', 'dateSettled', 'startDate', 'endDate', 'dischargeDate', 'loanAmount', 'loanBalance', 'commissionAmount', 'totalAmount', 'commissionType', 'statementId']
    data = [[[statement[key] for key in header] for statement in loanAccount]+[['' for _ in header]] for loanAccount in data]
    data = [header]+[statements for loanAccount in data for statements in loanAccount]

with open('statementLines.csv', mode='w') as csv_file:
    csv_writer = csv.writer(csv_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    csv_writer.writerows(data)