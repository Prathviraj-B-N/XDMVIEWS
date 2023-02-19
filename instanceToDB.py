import xml.etree.ElementTree as ET
import sqlite3

# Parse the XML document
tree = ET.parse('example.xml')
root = tree.getroot()

# Connect to a SQLite database
conn = sqlite3.connect('example.db')
c = conn.cursor()

# Create tables in the database
c.execute('CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT)')
c.execute('CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount REAL)')

# Iterate through the XML document and populate the database
for customer in root.findall('customer'):
    # Insert customer data into the customers table
    customer_id = customer.get('id')
    name = customer.find('name').text
    email = customer.find('email').text
    c.execute('INSERT INTO customers (id, name, email) VALUES (?, ?, ?)', (customer_id, name, email))
    
    for order in customer.findall('order'):
        # Insert order data into the orders table
        order_id = order.get('id')
        amount = order.find('amount').text
        c.execute('INSERT INTO orders (id, customer_id, amount) VALUES (?, ?, ?)', (order_id, customer_id, amount))

# Commit changes to the database and close the connection
conn.commit()
conn.close()
