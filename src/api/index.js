import fetch from 'isomorphic-fetch';

const parseJSON = (response) => {
    return response.json();
};

const checkStatus = (response) => {
    if(response.ok) {
        return response;
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
};

const endpoint = 'http://gifster.local/dbjumper/';

export const fetchTablesListing = () => {

    return fetch(endpoint + '?action=get_tables_listing').then(checkStatus).then(parseJSON);
};

export const fetchTableData = (query) => {

    return fetch(endpoint + '?action=get_table_data&query=' + query).then(checkStatus).then(parseJSON);
};

export const fetchTableMeta = (table) => {

    return fetch(endpoint + '?action=get_table_meta&table=' + table).then(checkStatus).then(parseJSON);
};