dbjumper
=========
Navigate relational DBs with ease.

### Installation

1. Cd into the root dir of the repository
2. Run `cp .env.example .env` 
3. Fill .env file with your DB credentials
4. Run `npm install`
5. Run `npm start`
6. Open http://localhost:3000/

#### Filtering
Tab/Enter to select a suggestion. If there's no suggestions, Enter submits the query, Tab creates a new query input.

![alt tag](https://github.com/yury-n/dbjumper/blob/master/demo/filtering.gif)

#### Connections
(Cmd/Ctrl)+Click on a TD or TH. Tab/Enter to select a suggestion. If there's no suggestions, Enter creates a connection with a specified table as a new board item, Cmd/Cntrl+Enter -- connects it inside the same board item.

![alt tag](https://github.com/yury-n/dbjumper/blob/master/demo/connections.gif)

##### Creating connection from query
Syntax: +joined_table(initial_table_key=joined_table_key) or +joined_table(key), if they have the same name. This performs left join operation. 

![alt tag](https://github.com/yury-n/dbjumper/blob/master/demo/inline_connections.gif)

Alt+Click to hide a column.

#### Not implemented [yet]
* Relational DBs other than MySQL
* Filtering by operands other than '='
* Inline joins using a column from a joined table
* Pagination
* Sorting

License
-------

Licensed under MIT.