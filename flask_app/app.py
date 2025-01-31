from flask import Flask, render_template, request, redirect, jsonify
import requests
import hashlib
import hmac
import time
import json
import concurrent.futures
import os
import re
from datetime import datetime
from collections import namedtuple
from sqlalchemy import Column, String, Integer, DateTime, func, Float
from queue import Queue
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
db_url = 'mysql+mysqlconnector://root:asdf1234@localhost:3306/crypto_base'
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

database = SQLAlchemy(app)

bitcoin = None
etherium  = None
litecoin = None

api_key = '4b522f4ed067b2c314d00c4a9cbab982121416668aa2b41ec3ac72c18f771092'
secret_key = 'JJSTSZR4FRSEKU3SNBFEQTJTHFWTYOKA'

class AutoKeyDict:
    def __init__(self):
        self.data = {}
        
    def add_dictionary(self, dictionary):
        key = len(self.data) + 1 
        self.data[key] = dictionary


class db(database.Model):
   
    ime = database.Column(database.String(255))
    prezime = database.Column(database.String(255))
    adresa = database.Column(database.String(255))
    grad = database.Column(database.String(255))
    drzava = database.Column(database.String(255))
    brojtelefona = database.Column(database.String(20))
    email = database.Column(database.String(255), primary_key=True)
    lozinka = database.Column(database.String(255))
    
    
    def to_dict(self):
        return {
            'name' : self.ime,
            'surname' : self.prezime,
            'address' : self.adresa,
            'city' : self.grad,
            'country' : self.drzava,
            'phoneNumber' : self.brojtelefona,
            'email' : self.email,
            'password' : self.lozinka,
        }

class crypto(database.Model):
    
    email=database.Column(database.String(255))
    currency = database.Column(database.String(45))
    price = database.Column(database.Float(15, 3))
    time = database.Column(database.DateTime(timezone=True), default=func.now(), primary_key=True)
    old_price = database.Column(database.Float(15, 3))
    
    
    def to_dict(self):
        return {
            'email' : self.email,
            'currency' : self.currency,
            'price' : self.price,
            'time' : self.time,
            'old_price' : self.old_price,
            
        }
        

    

class transactions(database.Model):
    email=database.Column(database.String(255))
    time = database.Column(database.DateTime(timezone=True), default=func.now(), primary_key=True)
    currency = database.Column(database.String(45))
    quantity = database.Column(database.Integer)
    price_per_coin = database.Column(database.Float(15, 3))
    price = database.Column(database.Float(15, 3))
    transaction_type = database.Column(database.String(15))
    
    def to_dict(self):
        return {
            'email' : self.email,
            'time' : self.time,
            'currency' : self.currency,
            'quantity' : self.quantity,
            'price_per_coin' : self.price_per_coin,
            'price' : self.price,
            'transaction_type' : self.transaction_type,
            
        }
    
def generate_signature(api_key, secret_key, nonce, path, data=''):
  
    message = f"{nonce}{api_key}{path}{data}"
    signature = hmac.new(secret_key.encode('utf-8'), message.encode('utf-8'), hashlib.sha256).hexdigest()
    
    
def get_crypto_exchange_dataBTC():
    
    url = 'https://api.cex.io/ticker/BTC/USD'  # Primer URL-a za dohvatanje podataka o Bitcoin-u u odnosu na USD na CEX.io
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Error: {response.status_code}")
        return None

def get_crypto_exchange_dataETH():
    url = 'https://cex.io/api/ticker/ETH/USD'  # Primer URL-a za dohvatanje podataka o Ethereum-u u odnosu na USD na CEX.io
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Error: {response.status_code}")
        return None
    
def get_crypto_exchange_dataLTC():
    url = 'https://cex.io/api/ticker/LTC/USD'  # Primer URL-a za dohvatanje podataka o Litecoin-u u odnosu na USD na CEX.io
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Error: {response.status_code}")
        return None


@app.route('/getBTC', methods = ['POST'])
def getBTC():
    
    url = 'https://cex.io/api/ticker/BTC/USD'
    nonce = str(int(time.time() * 1000))
    path = '/api/ticker/BTC/USD'
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'YourApp/1.0',
        'CEX-API-KEY': api_key,
        'CEX-API-SIGN': generate_signature(api_key, secret_key, nonce, path)
    }
    global bitcoin
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        bitcoin = data
        return jsonify({'success': True,'crypto': data})
    else:
       
        print(f"Error: {response.status_code}")
        return jsonify({'success': False})


def give_BTC():
    url = 'https://cex.io/api/ticker/BTC/USD'
    nonce = str(int(time.time() * 1000))
    path = '/api/ticker/BTC/USD'
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'YourApp/1.0',
        'CEX-API-KEY': api_key,
        'CEX-API-SIGN': generate_signature(api_key, secret_key, nonce, path)
    }
    #global bitcoin
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        
        data = response.json()
        return data
    else:
        print(f"Error: {response.status_code}")
        

@app.route('/getETH', methods = ['POST'])    
def get_ETH():
    url = 'https://cex.io/api/ticker/ETH/USD'
    nonce = str(int(time.time() * 1000))
    path = '/api/ticker/BTC/USD'
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'YourApp/1.0',
        'CEX-API-KEY': api_key,
        'CEX-API-SIGN': generate_signature(api_key, secret_key, nonce, path)
    }
    global etherium
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        etherium = data
        return jsonify({'success': True, 'crypto': data})
    else:
        print(f"Error: {response.status_code}")
        return jsonify({'success': False})
    
def give_ETH():
    url = 'https://cex.io/api/ticker/ETH/USD'
    nonce = str(int(time.time() * 1000))
    path = '/api/ticker/BTC/USD'
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'YourApp/1.0',
        'CEX-API-KEY': api_key,
        'CEX-API-SIGN': generate_signature(api_key, secret_key, nonce, path)
    }
    
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Error: {response.status_code}")
      

@app.route('/getLTC', methods = ['POST']) 
def get_LTC():
    url = 'https://cex.io/api/ticker/LTC/USD'
    nonce = str(int(time.time() * 1000))
    path = '/api/ticker/BTC/USD'
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'YourApp/1.0',
        'CEX-API-KEY': api_key,
        'CEX-API-SIGN': generate_signature(api_key, secret_key, nonce, path)
    }
    global litecoin
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        
        data = response.json()
        litecoin = data
        return jsonify({'success': True, 'crypto': data})
    else:
        print(f"Error: {response.status_code}")
        return jsonify({'success': False})

def give_LTC():
    url = 'https://cex.io/api/ticker/LTC/USD'
    nonce = str(int(time.time() * 1000))
    path = '/api/ticker/BTC/USD'
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'YourApp/1.0',
        'CEX-API-KEY': api_key,
        'CEX-API-SIGN': generate_signature(api_key, secret_key, nonce, path)
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        return  data
    else:
        print(f"Error: {response.status_code}")
        

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'OPTIONS, POST')
    return response

def is_valid_email(email):
    
    pattern = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
    return bool(re.match(pattern, email))

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')  
    passw= data.get('password')
    
   
    user = db.query.filter_by(email=email, lozinka=passw).first()
    if user:
        return jsonify({'success': True,  'email':user.email})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'})
    
    
@app.route('/Logout', methods=['POST'])
def Logout():
    data = request.get_json()
    email=data.get('session')
    if email!="empty":
        email=email.replace('"', '')
    
   
    user = db.query.filter_by(email=email).first()
    if user:
        return jsonify({'success':True, 'message' : "Uspjesno ste se odjavili iz svog walleta"})
    else:
        return jsonify({'success':False, 'message' : "Greska prilikom odjavljivanja"})
    
   
    
@app.route('/userhome', methods=['POST'])    
def userdata(): 
    data = request.get_json()
    email=data.get('storedUserData')
    email=email.replace('"', '')
    
   
    user = db.query.filter_by(email=email).first()
    
    if user:
        return jsonify({'success': True, 'email': user.email, 'name' : user.ime, 'surname': user.prezime, 'address': user.adresa, 'city': user.grad,'country': user.drzava,'phone_number': user.brojtelefona,'password': user.lozinka })
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'})           
    
@app.route('/registracija', methods = ['POST'])                
def registracija():
    data = request.get_json()
    ime = data.get('ime')
    prezime = data.get('prezime')
    adresa = data.get('adresa')
    grad = data.get('grad')
    drzava = data.get('drzava')
    brojtelefona = data.get('brojtelefona')
    email = data.get('email')
    
    lozinka = data.get('lozinka')
    if not is_valid_email(email):
        return jsonify({'success':False,'message':'Format nije validan'})
    baza = db.query.all()
    for b in baza:
        if b.email == email:
            return jsonify({'success':False,'message':'Korisnik vec postoji'})
    if ime == '':
        return jsonify({'success':False,'message': "Polje 'ime' mora biti popunjeno" })
    elif prezime == '':
        return jsonify({'success':False,'message': "Polje 'prezime' mora biti popunjeno" })
    elif adresa == '':
        return jsonify({'success':False,'message': "Polje 'adresa' mora biti popunjeno" })
    elif grad == '':
        return jsonify({'success':False,'message': "Polje 'grad' mora biti popunjeno" })
    elif drzava == '':
        return jsonify({'success':False,'message': "Polje 'drzava' mora biti popunjeno" })
    elif brojtelefona == '':
        return jsonify({'success':False,'message': "Polje 'brojtelefona' mora biti popunjeno" })
    elif lozinka == '':
        return jsonify({'success':False,'message': "Polje 'lozinka' mora biti popunjeno" })
    elif email == '':
        return jsonify({'success':False,'message': "Polje 'email' mora biti popunjeno" })

    new_user = db(ime = ime, prezime = prezime, adresa = adresa, grad = grad, drzava = drzava, brojtelefona = brojtelefona, email = email, lozinka = lozinka)
    database.session.add(new_user)
    database.session.commit()
    return jsonify({'success':True,'email': new_user.email})           

@app.route('/edit', methods = ['POST'])                
def edit():
    data = request.get_json()
    recvFirstName = data['name']
    recvLastName = data['surname']
    recvAddress = data['address']
    recvCity =  data['city']
    recvCountry = data['country']
    recvPhoneNumber = data['phoneNumber']
    recvPassword = data['password']
    recvNewPassword = data['newPassword']
    recvOldEmail = data['oldEmail']
    
    recvOldEmail=recvOldEmail.replace('"', '')
    checkUser = db.query.filter_by(email = recvOldEmail).first()
    
    if checkUser:
        
        if checkUser.lozinka == recvPassword:
            
            checkUser.ime = recvFirstName
            checkUser.prezime = recvLastName
            checkUser.adresa = recvAddress
            checkUser.grad = recvCity
            checkUser.drzava = recvCountry
            checkUser.brojtelefona = recvPhoneNumber
            checkUser.email = recvOldEmail
            checkUser.lozinka = recvNewPassword
            database.session.commit()
            userDict = checkUser.to_dict()
            return jsonify({'user':userDict, 'success' : True, 'message': 'Data changed successfully!'}), 200
        else:
            return jsonify({'success':False,'message': 'Error, the password is not correct'}), 400
    else:
        return jsonify({'success':False,'message': 'Error, edit not succeeded'}), 404
    
  

    

@app.route('/showCrypto', methods = ['POST'])                
def showCrypto():
    data = request.get_json()
    email=data.get('email_old')
    email=email.replace('"', '')
    checkUser = db.query.filter_by(email = email).first()
    baza = transactions.query.all()
    counter=0
    counterB=0
    counterE=0
    counterL=0
    rijecnik = AutoKeyDict()
    data_list = []
    if checkUser:
        
        for b in baza:
            if b.email==checkUser.email:
                d= b.to_dict()
                rijecnik.add_dictionary(d)
                counter+=1
                if b.currency=='BTC':
                    counterB+=1
                elif   b.currency=='ETH':
                    counterE+=1
                elif b.currency=='LTC':
                    counterL+=1
    else:
        return jsonify({'success' : False, 'message' : "No one with that email"})
    return jsonify({'success' : True, 'message' : "User found", 'users':  rijecnik.data, 'all_crypto' : counter, 'btc_counter': counterB, 'eth_counter': counterE, 'ltc_counter': counterL})



    
    
@app.route('/calculateProfit', methods = ['POST'])
def calculateProfit():
    data = request.get_json()
    crypto_baza = transactions.query.all()
    email=data.get('email_old')
    email=email.replace('"', '')
    btc_quantity=0
    ltc_quantity=0
    eth_quantity=0
    all_profit=0
    all_value=0
    global bitcoin
    global etherium
    global litecoin
    checkUser = db.query.filter_by(email = email).first()
    """
    get_LTC()
    getBTC()
    get_ETH()
    """
    
    with concurrent.futures.ProcessPoolExecutor() as executor:
       f1 = executor.submit(give_BTC)
       f2 = executor.submit(give_ETH)
       f3 = executor.submit(give_LTC)
       bitcoin = f1.result()
       etherium = f2.result()
       litecoin = f3.result()
    
    current_btc=float(bitcoin['last'])
    current_ltc=float(litecoin['last'])
    current_eth=float(etherium['last'])
    value_btc=0
    value_ltc=0
    value_eth=0
    
    for c in crypto_baza: 
        if c.email==checkUser.email:
            if c.currency=='BTC':
                
                if c.transaction_type=='kupovina':
                    value_btc += (current_btc - float(c.price_per_coin))*c.quantity
                    btc_quantity+=c.quantity
                else:
                    value_btc += (float(c.price_per_coin) - current_btc )*c.quantity
            elif c.currency=='ETH':
                
                if c.transaction_type=='kupovina':
                    value_eth += (current_eth - float(c.price_per_coin))*c.quantity
                    eth_quantity += c.quantity
                else:
                    value_eth += (float(c.price_per_coin) - current_eth )*c.quantity
            elif c.currency=='LTC':
                if c.transaction_type=='kupovina':
                    ltc_quantity+=c.quantity
                    value_ltc += (current_ltc - float(c.price_per_coin))*c.quantity  
                else:
                    value_ltc += (float(c.price_per_coin) - current_ltc )*c.quantity
    
               
    btc_quantity = btc_quantity * current_btc
    eth_quantity = eth_quantity * current_eth
    ltc_quantity = ltc_quantity * current_ltc
    all_value = btc_quantity + eth_quantity + ltc_quantity
    all_profit = value_btc + value_eth + value_ltc  
    
    
    return jsonify({'success': True, 'bilans' : all_profit, 'value': all_value, 'bilansBTC' : value_btc, 'bilansETH' : value_eth, 'bilansLTC' : value_ltc, 'valueBTC' : btc_quantity, 'valueLTC': ltc_quantity  , 'valueETH' : eth_quantity})    
     
    

@app.route('/addNewTransaction', methods = ['POST'])
def addNewTransaction():
    data = request.get_json()
    email=data.get('email_old')
    email=email.replace('"', '')
    checkUser = db.query.filter_by(email = email).first()
    if checkUser:
        return jsonify({'success':True, 'message':"Akcija uspjesna"})
    else:
         return jsonify({'success':False, 'message':"Akcija neuspjesna"})
     
@app.route('/prodaja', methods=['POST'])
def prodaja():
    data = request.get_json()
    email=data['email']
    transactionType=data['text']
    currencyName = data['currencyName']
    quantity=data['quantity']
    pricePerCoin=data['pricePerCoin']
    date=data['date']
    totalReceived=data['totalReceived']
    email=email.replace('"', '')
    if currencyName=='':
        return jsonify({'success':False, 'message':"Polje 'currency' mora biti popunjeno"})
    elif quantity=='' or quantity<1:
        return jsonify({'success':False, 'message':"Polje 'quantity' mora biti popunjeno i mora biti vece od nule"})
    elif pricePerCoin=='' or pricePerCoin<1:
        return jsonify({'success':False, 'message':"Polje 'pricePerCoin' mora biti popunjeno i mora biti vece od nule"})
    elif date == '':
        return jsonify({'success':False, 'message':"Polje 'date' mora biti popunjeno"})
    transakcije = transactions.query.all()
    for t in transakcije:
        if t.time == date:
            return jsonify({'success':False, 'message':"Datum i vrijeme postoje vec za neku drugu transakciju"})

    checkUser = db.query.filter_by(email = email).first()
    if checkUser:
        transaction = transactions(email=email, time=date, currency= currencyName, quantity= quantity, price_per_coin = pricePerCoin, price = totalReceived, transaction_type = transactionType)
        database.session.add(transaction)
        database.session.commit()
        return jsonify({'success' : True})
    else:
        return jsonify({'success' : False})
        
@app.route('/kupovina', methods=['POST'])
def kupovina():
    data = request.get_json()
    email=data['email']
    transactionType=data['text']
    currencyName = data['currencyName']
    quantity=data['quantity']
    pricePerCoin=data['pricePerCoin']
    date=data['date']
    totalReceived=data['totalReceived']
    email=email.replace('"', '')
    
    if currencyName=='':
        return jsonify({'success':False, 'message':"Polje 'currency' mora biti popunjeno"})
    elif quantity=='' or int(quantity)<1:
        return jsonify({'success':False, 'message':"Polje 'quantity' mora biti popunjeno i mora biti vece od nule"})
    elif pricePerCoin=='' or float(pricePerCoin)<1.0:
        return jsonify({'success':False, 'message':"Polje 'pricePerCoin' mora biti popunjeno i mora biti vece od nule"})
    elif date == '':
        return jsonify({'success':False, 'message':"Polje 'date' mora biti popunjeno"})
    transakcije = transactions.query.all()
    for t in transakcije:
        if t.time == date:
            return jsonify({'success':False, 'message':"Datum i vrijeme postoje vec za neku drugu transakciju"})
    checkUser = db.query.filter_by(email = email).first()
    if checkUser:
        transaction = transactions(email=email, time=date, currency= currencyName, quantity= quantity, price_per_coin = pricePerCoin, price = totalReceived, transaction_type = transactionType)
        database.session.add(transaction)
        database.session.commit()
        return jsonify({'success' : True})
    else:
        return jsonify({'success' : False})
    
@app.route('/deleteTransaction', methods=['POST'])
def deleteTransaction():
    data = request.get_json()
    time = data.get('item')    
    
    crypto=transactions.query.all()
    date_object = datetime.strptime(time, '%a, %d %b %Y %H:%M:%S %Z')
    formatted_date = date_object.strftime('%Y-%m-%d %H:%M:%S')
    date= datetime.strptime(formatted_date, '%Y-%m-%d %H:%M:%S')
    
    for c in crypto:
        if c.time==date:
            database.session.delete(c)
            database.session.commit()
    return jsonify({'success' : True})
    
     
if __name__=="__main__":
   
    app.run(debug=True)
