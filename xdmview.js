const fs = require("fs");
const xml2js = require("xml2js");
const mysql = require("mysql");

function init(xmlFilePath) {
  // Read the XML file
  const xmlData = fs.readFileSync(xmlFilePath, "utf-8");

  // Parse the XML data to a JavaScript object
  const parser = new xml2js.Parser();
  parser.parseString(xmlData, (err, result) => {
    if (err) {
      console.error("Failed to parse the XML data:", err);
      return;
    }

    // Extract the sources and their configurations
    const sources = {};
    result.xdmview.source.forEach((source) => {
      const type = source.$.type;
      const config = {
        url: source.$.url,
        name: source.$.name,
      };

      // Add type-specific configurations
      if (type === "mysql") {
        config.username = source.$.username;
        config.password = source.$.password;
      }

      sources[config.name] = {
        type,
        config,
      };
    });

    // Create the views based on the specified bases and parents
    result.xdmview.base?.forEach((base) => {
      const sourceName = base.$.source;
      const source = sources[sourceName];
      const baseName = base.$.name;
      const fields = base.field.map((field) => ({
        name: field._,
        conditions: field.$.conditions,
        selected: field.$.selected === "true",
      }));

      // TODO: Create the base view using the specified source and fields
      console.log(
        `Creating base view '${baseName}' using ${source.type} source '${sourceName}' with fields:`,
        fields
      );
    });
  });
}


function connectMySQL() {

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");

    connection.query(
      "CREATE VIEW myview AS SELECT * FROM db1.table1 JOIN db2.table2 ON db1.table1.id = db2.table2.id",
      (err, result) => {
        if (err) throw err;
        console.log("View created!");
        console.log(result);
      }
    );
  });
}

// Example usage:
init("./inputXml.xml");
// connectMySQL();
