Clientlinker-flow-mysql
========================

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]


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



[npm-image]: http://img.shields.io/npm/v/i18nc-core.svg
[downloads-image]: http://img.shields.io/npm/dm/i18nc-core.svg
[npm-url]: https://www.npmjs.org/package/i18nc-core
[license-image]: http://img.shields.io/npm/l/i18nc-core.svg
