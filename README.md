dbjumper
=========
Navigate relational DBs with ease.

### Installation

1. Make sure you have `git`, `node`, and `npm` installed.
2. Clone this repository locally.
3. Cd into the root dir of the repository.
4. Run `cp .env.example .env`.
5. Fill `.env` file with your DB credentials.
6. Run `npm install`.
7. Run `npm start`.
8. Open `http://localhost:3000/` in your browser.

#### Filtering
Tab/Enter to select a suggestion. If there's no suggestions, Enter submits the query, Tab creates a new query input.

![alt tag](https://github.com/yury-n/dbjumper/blob/master/demo/filtering.gif)

#### Connections
(Cmd/Ctrl)+Click on a TD or TH. Tab/Enter to select a suggestion. If there's no suggestions, Enter creates a connection with a specified table as a new board item, Cmd/Ctrl+Enter -- connects it inside the same board item.

![alt tag](https://github.com/yury-n/dbjumper/blob/master/demo/connections.gif)

##### Creating connection from query
Syntax: "+joined_table(initial_table_key=joined_table_key)" or "+joined_table(key)", if they have the same name. This performs left join operation. 

![alt tag](https://github.com/yury-n/dbjumper/blob/master/demo/inline_connections.gif)

#### Table columns info
Syntax: "table#"

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
