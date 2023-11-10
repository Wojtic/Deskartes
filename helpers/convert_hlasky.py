import json, io

filename = './helpers/hlasky.txt'
output_path = './src/data/hlasky.json'

array = []
fields =['person', 'title', 'text']

with io.open(filename, 'r', encoding="utf-8") as fh:
    myarray = fh.read().split("\n\n")
    for lines in myarray:
        hlaska = lines.split('\n')
        dict1 = {}
        for i in range(3):
            dict1[fields[i]] = hlaska[i]
        array.append(dict1)

out_file = io.open(output_path, "w", encoding="utf-8")
json.dump(array, out_file, indent = 2, ensure_ascii=False)
out_file.close()
