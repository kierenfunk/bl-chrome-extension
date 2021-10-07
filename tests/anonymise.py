import json
import names
import string
import random

def randomise(original_list, generator):
    result = []
    while len(result) < len(original_list):
        choice = generator()
        if choice not in result:
            result.append(choice)
    return {a:b for a,b in zip(original_list, result)}

if __name__ == "__main__":
    with open('commissions.json') as json_file:
        data = json.load(json_file)

    # randomise account names
    account_names = set([row['accountName'] for row in data])
    account_names_map = {name:names.get_full_name() for name in account_names}

    # randomise lender names
    lender_names_map = randomise(
        set([item['lender'] for row in data for item in row['results']]),
        lambda:''.join(random.choice(string.ascii_uppercase) for i in range(3))
    )

    # randomise loan names
    loan_names_map = randomise(
        set([item['loanName'].strip() for row in data for item in row['results']]), 
        lambda:names.get_full_name()
    )

    # randomise account numbers
    account_number_map = randomise(
        set([item['accountNumber'] for row in data for item in row['results']]), 
        lambda:''.join(random.choice(string.digits) for i in range(8))
    )

    for row in data:
        for key in row:
            if key not in ['totalCount', 'count', 'offset', 'results', 'accountName', 'startDate', 'endDate']:
                row[key] = None
            if key == 'accountName':
                row[key] = account_names_map[row[key]]
            if key == 'results': 
                for item in row['results']:
                    for item_key in item:
                        if item_key in ['uniqueId', 'deletedByDisplay', 'parentType', 'parentId', 'associateId', 'introducer', 'comments']:
                            item[item_key] = None
                        if item_key == 'dateSettled': 
                            item[item_key] = 1633544476000
                        if item_key == 'associateName':
                            item[item_key] = 'Ben Broker'
                        if item_key in ['lender', 'lenderNameShort']:
                            item[item_key] = lender_names_map[item['lender']] if item['lender'] in lender_names_map else item['lender']
                        if item_key == 'accountNumber':
                            item[item_key] = account_number_map[item[item_key]]
                        if item_key == 'loanName':
                            item[item_key] = loan_names_map[item[item_key].strip()]

    with open('commissions-test.json', 'w') as outfile:
        json.dump(data, outfile)
