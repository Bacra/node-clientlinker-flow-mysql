Clientlinker-flow-mysql
========================

# Install

Install `clientlinker` pkg

```shell
npm i clientlinker --save`
```

Install flow pkg

```shell
npm i clientlinker-flow-mysql --save
```


# Useage

```javascript
var clientlinker = require('clientlinker');
var linker = clientlinker({
	flows: ['mysql'],
	clients: {
		mysqlCustomClient: {
			mysqlConfigFile: '/etc/dbconfig.conf',
			mysqlConfigKey: 'DBItemName',
			mysqlhandler: {
				clientHanlder: {
					sql: 'SELECT `name` FROM `db_example` WHERE `id`= ?',
					keys: ['id'],
				}
			}
		}
	}
});

linker.loadFlow('mysql', 'clientlinker-flow-mysql', module);


// use
linker.run('mysqlCustomClient.clientHanlder', null, {id: 13})
	.then(function(){});
```
