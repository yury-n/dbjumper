import fetch from 'isomorphic-fetch';

const delay = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const fetchTableListingFake = () =>
    delay(500).then(() => {
        return [
            {'tablename': 'accounting', columnames: []},
            {'tablename': 'users', columnames: []},
            {'tablename': 'orders', columnames: []},
            {'tablename': 'cart_items', columnames: []},
            {'tablename': 'cart_shipping', columnames: []},
            {'tablename': 'cart_orders', columnames: ['recordid', 'orderid', 'userid', 'ts', 'shipping_date', 'merchantid', 'processorid']},
        ];
    });

export const fetchTableListing = () => {

    return fetch('http://gifster.local/dbapi/get_table_listing.php').then(r => r.json());

};

export const fetchTable = (table) => {

};