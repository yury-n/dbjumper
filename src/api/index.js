const delay = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const fetchTableList = () =>
    delay(500).then(() => {
        return [
            {'tablename': 'accounting'},
            {'tablename': 'users'},
            {'tablename': 'orders'},
            {'tablename': 'cart_items'},
            {'tablename': 'cart_shipping'},
            {'tablename': 'cart_orders'},
        ];
    });