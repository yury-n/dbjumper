const delay = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const fetchTableListing = () =>
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