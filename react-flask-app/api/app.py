from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS

# Connecting Flask Application with MySQL Database
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://developer:developer@localhost/mydb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)


# Create Table Contactinfo

class Contactinfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    phone_number = db.Column(db.String(80))
    job_title = db.Column(db.String(80))
    country = db.Column(db.String(80), default='Canada')

    def __init__(self, first_name, last_name, phone_number, job_title):
        self.first_name = first_name
        self.last_name = last_name
        self.phone_number = phone_number
        self.job_title = job_title

# Define Schema

class ContactInfoSchema(ma.Schema):
    class Meta:
        fields = ('id', 'first_name', 'last_name', 'phone_number', 'job_title', 'country')



contact_info_schema = ContactInfoSchema()
contacts_info_schema = ContactInfoSchema(many=True)


# All contacts info from database

@app.route('/get', methods=['GET'])
def get_contacts_info():
    all_contacts = Contactinfo.query.all()
    results = contacts_info_schema.dump(all_contacts)
    return jsonify(results)

# Single contact info from database

@app.route('/get/<id>', methods=['GET'])
def get_contact_details(id):
    contact = Contactinfo.query.get(id)    
    return contact_info_schema.jsonify(contact)


# Add contact info into the database

@app.route('/add', methods=['POST'])
def add_contactinfo():
    first_name = request.json['first_name']
    last_name = request.json['last_name']
    phone_number = request.json['phone_number']
    job_title = request.json['job_title']


    contacts = Contactinfo(first_name, last_name, phone_number, job_title)
    db.session.add(contacts)
    db.session.commit()
    return contact_info_schema.jsonify(contacts)


# Update contact info into the database

@app.route('/update/<id>', methods=['PUT'])
def update_contact_info(id):
    contact = Contactinfo.query.get(id)

    first_name = request.json['first_name']
    last_name = request.json['last_name']
    phone_number = request.json['phone_number']
    job_title = request.json['job_title']
    

    contact.first_name = first_name
    contact.last_name = last_name
    contact.phone_number = phone_number
    contact.job_title = job_title


    db.session.commit()

    return contact_info_schema.jsonify(contact)


# Delete contact info from the database

@app.route('/delete/<id>', methods=['DELETE'])
def delete_contact_info(id):
    contact = Contactinfo.query.get(id)
    
    db.session.delete(contact)
    db.session.commit()

    return contact_info_schema.jsonify(contact)




if __name__ == '__main__':
    app.run(debug=True)
