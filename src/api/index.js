import fetch from 'isomorphic-fetch';

export const fetchTablesListing = () => {

    return fetch('/get_tables_listing').then(r => r.json());

};

export const fetchTableData = (query) => {

    return fetch('/get_table_data?query=' + query).then(r => r.json());
};

export const fetchTableMeta = (table) => {

    // todo
};