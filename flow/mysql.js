var _		= require('lodash');
var Promise	= require('bluebird');
var fs		= Promise.promisifyAll(require('fs'));
var ini		= require('ini');
var debug	= require('debug')('clientlinker-flow-mysql');
var mysql	= require('mysql');


exports = module.exports = function mysql(runtime, callback)
{
	var client = runtime.client;
	var options = client.options;
	// handlerConfig
	// [sql]          sql 模版，见mysql包
	// [keys]         sql的values对应runtime.body的转化顺序
	// [onlyFirst]    返回结果取第一条数据
	var handlerConfig = options.mysqlhandler && options.mysqlhandler[runtime.method];
	if (!handlerConfig) return callback.next();

	return initPool(client)
		.then(function(pool)
		{
			if (!pool) return callback.next();

			return new Promise(function(resolve, reject)
			{
				pool.getConnection(function(err, connection)
				{
					if (err) return reject(err);

					var values = translateValues(runtime.body, handlerConfig.keys);

					connection.query(handlerConfig.sql, values, function(err, results)
					{
						if (err)
							reject(err);
						else
							resolve(handlerConfig.onlyFirst ? results && results[0] : results);

						connection.release();
					});
				});
			});

		});
}

exports.methods = function(client)
{
	return initPool(client)
		.then(function(pool)
		{
			if (!pool) return;

			var options = client.options;
			if (options.mysqlhandler && typeof options.mysqlhandler == 'object')
			{
				return Object.keys(options.mysqlhandler);
			}
		});
}


function initPool(client)
{
	if (client.mysqlPool) return Promise.resolve(client.mysqlPool);

	var options = client.options;
	var getConfigPromise;


	// 如果有配置文件，优先使用配置文件
	if (options.mysqlConfigFile && options.mysqlConfigKey)
	{
		getConfigPromise = fs.readFileAsync(options.mysqlConfigFile, {encoding: 'utf8'})
			.then(function(data)
			{
				var json = ini.parse(data);
				debug('config json:%o', json);
				var config = json && json[options.mysqlConfigKey];

				if (!config) return options.mysql;

				// 格式转化
				// 运维的格式是固定的，非常给力
				return _.extend({}, options.mysql,
					{
						port		: config.DBPort,
						host		: config.DBIP,
						user		: config.DBUser,
						password	: config.DBPass,
						database	: config.DBName
					});
			})
			.catch(function(err)
			{
				debug('read config err:%o', err);

				return options.mysql;
			});
	}
	else
	{
		getConfigPromise = Promise.resolve(options.mysql);
	}


	return getConfigPromise.then(function(config)
	{
		debug('mysql config:%o', config);
		if (!config
			|| !config.host
			|| !config.user
			|| !config.password
			|| !config.database)
		{
			return;
		}

		var linker = client.linker;
		var pools = linker.mysqlPools || (linker.mysqlPools = {});

		if (linker.mysqlPools)
		{
			client.mysqlPool = pools[client.name];
		}

		if (!client.mysqlPool)
		{
			client.mysqlPool = mysql.createPool(config);
		}


		return client.mysqlPool;
	});
}

function translateValues(body, keys)
{
	var values = [];
	if (!body || !keys) return values;

	var isArrayBody = Array.isArray(body);
	if (!isArrayBody) body = [body];

	body.forEach(function(params)
	{
		if (!params) return;

		var tmpValues = [];
		values.push(tmpValues);
		keys.forEach(function(name)
		{
			tmpValues.push(params[name]);
		});
	});
	if (!isArrayBody) values = values[0] || [];

	return values;
}
