// Load required resources =================================================================================================
const config = require('config/base.json');

// Load required resources =================================================================================================
const CronJob = require('cron').CronJob;
const fs = require('fs');


// Buscar todos los ficheros en la carpeta crons para ejecutar =============================================================
const cronFiles = fs.readdirSync('./crons').filter(file => file.endsWith('.js'));
for(const file of cronFiles) {
    const cmd = require(`./crons/${file}`);

    console.log('[cron cargado]',cmd.data.name);

    new CronJob( cmd.data.cronTime, cmd.execute, null, true, config.timezone );
}