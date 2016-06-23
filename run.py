from app.app import app
context = ('domain.crt', 'domain.key')
app.run(host='0.0.0.0', debug=True, port=8080, ssl_context=context)