const fs = require("fs");
const conf_file = "db_conf.json"
if (fs.existsSync(conf_file))
{
    var conf = JSON.parse(fs.readFileSync(conf_file,'utf-8'));
    module.exports = conf;
}
else 
{
    fs.writeFileSync(conf_file,'{\n\t"login":"username",\n\t"pass": "password",\n\t"URI":"dbURI"\n}', (err) => {if (err) throw err;});
    throw new Error("Please, configure database connection properties in db_conf.json");
}