from flask import Flask, render_template, request
from flask_mysqldb import MySQL
from flask_cors import CORS


# Connecting Flask Application with MySQL
app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'developer'
app.config['MYSQL_PASSWORD'] = 'developer'
app.config['MYSQL_DB'] = 'mydb'

mysql = MySQL(app)

# Insert Contact Info into MySQL Database
@app.route('/contactinfo', methods=['GET', 'POST'])
def contactinfo():
    if request.method == 'POST':
        try:
            # Reading the posted values from the UI
            content = request.get_json()
            _firstname = content['first_name']
            _lastname = content['last_name']
            _phonenumber = content['phone_number']
            _jobtitle = content['job_title']
            _country = content['country']
            # Creating a connection cursor
            cursor = mysql.connection.cursor()
            # Executing SQL Statements
            cursor.execute(''' INSERT INTO contactinfo(first_name,last_name,phone_number,job_title,country) VALUES(%s,%s,%s,%s,%s)''',
                           (_firstname, _lastname, _phonenumber, _jobtitle, _country))
            # Saving the Actions performed on the DB
            mysql.connection.commit()
            id = cursor.lastrowid
            # Closing the cursor
            cursor.close()
            return {"id": id, "first_name": _firstname, "last_name": _lastname, "phone_number": _phonenumber, "job_title": _jobtitle, "country": _country}
        except Exception as e:
            error = _firstname + ' is a duplicate name.'
            return {"error": error}




if __name__ == '__main__':
    app.run()
