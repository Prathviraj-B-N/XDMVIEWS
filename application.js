const cross_data_model = require('./xdmview.js');

// define the input file path, format, and RDBMS configuration options
const input_file_path = './test.json';
const input_file_format = 'rdbms';

const rdbms_config = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'market',
  table_name: 'catsum',
};

// call the read_input function
cross_data_model.read_input(input_file_path, input_file_format, rdbms_config)
  .then((input_data) => {
    // process the input data
    console.log(input_data);
  })
  .catch((err) => {
    // handle errors
    console.error(err);
  });
