import requests
import datetime
from bs4 import BeautifulSoup
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
    a = contact_column.find('a', recursive=False)
    insert_facilities(accom_dict, a['href'])


def insert_room(accom_dict, room_column):
    room_list = []
    all_room_column = room_column.find_all(True)
    for info in all_room_column:
        if info.name == 'br' and info.next_sibling.name != 'br' and info.next_sibling.strip() != '':
            room_dict = {}
            room = info.next_sibling.strip().split('\xa0/\xa0')
            room_dict['type'] = room[0].split(' ')[0]
            room_dict['price'] = int(room[1].split('\xa0')[1])
            room_dict['capacity'] = int(room[2].strip('person')[0])
            room_list.append(room_dict)

    accom_dict['rooms'] = room_list


def insert_location(accom_dict, location_column, fcode):
    all_location_column = location_column.find_all(True)
    address = ''
    for info in all_location_column:
        address += info.next_sibling.strip()
    address = address.replace(',,', ',').replace(', ', ',').replace('\r\n', '').replace(' ,', '')
    if fcode == 'KP':
        address = address.rsplit('Kampar', 1)[0].replace('Kampar', '')
    elif fcode == 'SL':
        address = address.rsplit('Kajang', 1)[0].replace('Kajang', '').rsplit('Selangor', 1)[0].replace('Selangor', '')
    address = address.strip().replace(',', ', ').replace('.,', '').replace(' , ', '').replace('  ', ' ')
    accom_dict['address'] = address


def insert_remark(accom_dict, remark_column):
    available_from = {}
    availability = remark_column.next_element.strip().split(' ')
    remarks = remark_column.next_element.next_element.next_element.strip()
    remarks = remarks.replace('\r\n', ' ')
    remarks = remarks.replace('  ', ' ')
    # available_from['month'] = datetime.datetime.strptime(availability[2], '%b').month
    available_from['month'] = availability[2]
    available_from['year'] = int(availability[3])
    # year = int(availability[3])
    # month = datetime.datetime.strptime(availability[2], '%b').month
    # available_from = datetime.datetime(year, month, 1)
    accom_dict['available_from'] = available_from
    accom_dict['remarks'] = remarks


def insert_facilities(accom_dict, detail_url):
    # print(detail_url)
    detail_url = 'http://www2.utar.edu.my/' + detail_url
    page = requests.get(detail_url)
    content = page.content

    soup = BeautifulSoup(content, 'html.parser')
    table = soup.find('table')
    rows = table.find_all('tr', recursive=False)
    facilities = rows[10].find_all('font')

    facilities_list = []
    for facility in facilities:
        if facility.text != 'Facilities:' and facility.text != 'Others:':
            facilities_list.append(facility.text)

    others = facilities_list.pop().split(', ')
    if others != ['']:
        facilities_list += others
    accom_dict['facilities'] = facilities_list
    page.close()


def insert_to_database(rooms):
    username = 'eugeneyjy'
    password = 'Dnthackmepls78'
    uri = 'mongodb+srv://' + username + ':' + password + '@room.88id4.mongodb.net/utar_accom?retryWrites=true&w=majority'
    client = MongoClient(uri)
    db = client.utar_accom
    room_collection = db.room
    room_collection.delete_many({})
    room_collection.insert_many(rooms)


def main():
    frenttype = 'frenttype=Room'
    fcodes = ['KP','SL']

    rooms = []

    for fcode in fcodes:
        url = 'http://www2.utar.edu.my/accomList.jsp?' + frenttype + '&fcode=' + fcode
        page = requests.get(url)
        content = page.content

        soup = BeautifulSoup(content, 'html.parser')
        results = soup.find(id='Room')
        table = results.find('table')
        rows = table.find_all(onmouseover=True)
        ID = 1
        for row in rows:
            columns = row.find_all('td')
            accom_dict = {'campus': fcode}
            i = 0
            for column in columns:
                if i == 1:
                    insert_contact(accom_dict, column)
                elif i == 2:
                    insert_room(accom_dict, column)
                elif i == 3:
                    insert_location(accom_dict, column, fcode)
                elif i == 4:
                    insert_remark(accom_dict, column)
                i += 1
            if accom_dict:
                accom_dict['ID'] = fcode + str(ID)
                rooms.append(accom_dict)
                ID += 1

        print('number of rooms: ' + str(len(rooms)))
        page.close()

    insert_to_database(rooms)


if __name__ == '__main__':
    main()
