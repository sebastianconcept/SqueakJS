| output |
output := FileStream fileNamed: 'output.txt'.
output nextPutAll: 'Hello World'.
output cr; nextPut: Character lf.
output nextPutAll: (6+5) asString.
output close.!

