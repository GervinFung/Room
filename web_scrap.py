import requests
import pprint
import unicodedata
import datetime
import pymongo
from bs4 import BeautifulSoup
from bs4 import NavigableString
from pymongo import MongoClient

def insert_contact(accom_dict, contact_column):
    contact_info = contact_column.find_all('b', recursive=False)
    name = contact_column.next_element
    for info in contact_info:
        process_str = info.next_sibling.strip()
        if info.text == 'Office No.:':
            accom_dict['office_no'] = process_str
        elif info.text == 'H/P No.:':
            accom_dict['hp_no'] = process_str
        elif info.text == 'Email:':
            accom_dict['email'] = process_str
    accom_dict['name'] = name.text

def insert_room(accom_dict, room_column):
    room_list = []
    all = room_column.find_all(True)
    for info in all:
        if(info.name == 'br' and info.next_sibling.name != 'br' and info.next_sibling.strip() != ''):
            room_dict = {}
            room = info.next_sibling.strip().split('\xa0/\xa0')
            room_dict['type'] = room[0].split(' ')[0]
            room_dict['price'] = room[1].split('\xa0')[1]
            room_dict['capacity'] = room[2].strip('person')[0]
            room_list.append(room_dict)

    accom_dict['rooms'] = room_list

def insert_location(accom_dict, location_column):
    all = location_column.find_all(True)
    address = ""
    for info in all:
        address += info.next_sibling.strip()
    address = address.replace('\r\n', '')
    address = address.replace(',,', ', ')
    accom_dict['address'] = address

def insert_remark(accom_dict, remark_column):
    available_from = {}
    availability = remark_column.next_element.strip().split(' ')
    remarks = remark_column.next_element.next_element.next_element.strip()
    remarks = remarks.replace('\r\n', ' ')
    remarks = remarks.replace('  ', ' ')
    available_from['month'] = datetime.datetime.strptime(availability[2], '%b').month
    available_from['year'] = availability[3]
    accom_dict['available_from'] = available_from
    accom_dict['remarks'] = remarks

def insert_to_database(rooms):
    username = "eugeneyjy"
    password = "Dnthackmepls78"
    uri = "mongodb+srv://" + username + ":" + password + "@room.88id4.mongodb.net/accom?retryWrites=true&w=majority"
    client = MongoClient(uri)
    db = client.utar_accom
    room_collection = db.room
    room_collection.delete_many({})
    room_collection.insert_many(rooms)

def main():
    frenttype = 'frenttype=Room'
    fcode = 'fcode=KP'
    url = 'http://www2.utar.edu.my/accomList.jsp?' + frenttype + '&' + fcode
    page = requests.get(url)
    content = page.content

    soup = BeautifulSoup(content, 'html.parser')
    results = soup.find(id='Room')
    table = results.find('table')
    rows = table.find_all(onmouseover=True)
    rooms = []
    for row in rows:
        columns = row.find_all('td')
        accom_dict = {}
        i = 0
        for column in columns:
            if i == 1:
                insert_contact(accom_dict, column)
            elif i == 2:
                insert_room(accom_dict, column)
            elif i == 3:
                insert_location(accom_dict, column)
            elif i == 4:
                insert_remark(accom_dict, column)
            i += 1
        if(accom_dict):
            rooms.append(accom_dict)

    print('number of rooms: ' + str(len(rooms)))

    insert_to_database(rooms)

main()
