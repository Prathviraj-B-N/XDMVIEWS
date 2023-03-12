const fs = require('fs');
const xml2js = require('xml2js');
const mysql = require('mysql');

/**
 * Reads input from a JSON, XML, or RDBMS file and returns the data as an object.
 *
 * @param {string} input_file_path - The path to the input file.
 * @param {string} input_file_format - The format of the input file ('json', 'xml', or 'rdbms').
 * @param {Object} [rdbms_config] - The configuration options for connecting to an RDBMS database (optional).
 * @returns {Promise<Object>} - A Promise that resolves to the input data as an object.
 */
function read_input(input_file_path, input_file_format, rdbms_config) {
  return new Promise((resolve, reject) => {
    if (input_file_format === 'json') {
      fs.readFile(input_file_path, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            const input_data = JSON.parse(data);
            resolve(input_data);
          } catch (parse_err) {
            reject(parse_err);
          }
        }
      });
    } else if (input_file_format === 'xml') {
      const parser = new xml2js.Parser();

      fs.readFile(input_file_path, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          parser.parseString(data, (parse_err, result) => {
            if (parse_err) {
              reject(parse_err);
            } else {
              resolve(result);
            }
          });
        }
      });
    } else if (input_file_format === 'rdbms') {
      const connection = mysql.createConnection(rdbms_config);

      connection.connect((connect_err) => {
        if (connect_err) {
          reject(connect_err);
        } else {
          const query = 'SELECT * FROM ' + rdbms_config.table_name;
          connection.query(query, (query_err, rows, fields) => {
            if (query_err) {
              reject(query_err);
            } else {
              resolve(rows);
            }
          });
        }
      });
    } else {
      reject(new Error('Invalid input file format.'));
    }
  });
}

module.exports = { read_input };
