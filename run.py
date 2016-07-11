import sys
from app.app import app

if len(sys.argv) == 1:
    print("Requires an argument: http or https")
else:
    if sys.argv[1] == 'http':
        app.run(host='127.0.0.1', port=8080)
    elif sys.argv[1] == 'https':
        context = ('domain.crt', 'domain.key')
        app.run(host='0.0.0.0', debug=True, port=8080, ssl_context=context)
