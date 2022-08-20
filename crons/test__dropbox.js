// Parámetros de APIs Utilizadas ===========================================================================================
const config = {
    accessToken: '',
    destinationPath: '/test1',
    file: './bigFile.zip'
};

// Load required resources =================================================================================================
const fs = require('fs');
const Dropbox = require('dropbox').Dropbox;

// Module script ===========================================================================================================
module.exports = {
    data: { name : 'dropbox', cronTime: '* * * * *' },
    async execute() {
        try {
            const dbx = new Dropbox({ accessToken: config.accessToken });

            // estructura creada según documentaciones;
            // aún no se ha testeado la funcionalidad
            // sigue en proceso de desarrollo!

            fs.readFile(config.file, 'utf8', (err, data) => {
                if (err) { console.error('[cronjob:dropbox:fsRead]', err.message); return; }

                const fileSize = fs.statSync(config.file);
                const fileName = path.basename(config.file);

                // Ficheros menor a 150Mb utilizan filesUpload
                // Ficheros mayor a 150Mb utilizan filesUploadSession

                if(fileSize < (150 * 1024 * 1024)) {
                    dbx.filesUpload({path: `/${config.destinationPath}/${fileName}`, contents: data}).then(function(rsp) {
                        console.log(rsp);
                    }).catch(function(error) {
                        console.error(error);
                    });
                } else {
                    // Por recomendaciones de Dropbox para el uso de esta API JS, se crean chunks de 8Mb para subir el fichero
                    const maxBlob = 8 * 1000 * 1000;

                    var workItems = [];

                    var offset = 0;

                    while (offset < fileSize) {
                        var chunkSize = Math.min(maxBlob, fileSize - offset);
                        workItems.push(data.slice(offset, offset + chunkSize));
                        offset += chunkSize;
                    }

                    const task = workItems.reduce((acc, blob, idx, items) => {
                        if(idx == 0) {
                            // Starting multipart upload of file
                            return acc.then(function () {
                                return dbx.filesUploadSessionStart({ close: false, contents: blob }).then((response) => response.session_id);
                            });
                        } else if(idx < items.length - 1) {
                            // Append part to the upload session
                            return acc.then(function (sessionId) {
                                var cursor = { session_id: sessionId, offset: idx * maxBlob };
                                return dbx.filesUploadSessionAppendV2({
                                    cursor: cursor,
                                    close: false,
                                    contents: blob,
                                }).then(() => sessionId);
                            });
                        } else {
                            // Last chunk of data, close session
                            return acc.then(function (sessionId) {
                                var cursor = { session_id: sessionId, offset: fileSize - blob.size };
                                var commit = {
                                    path: "/" + fileName,
                                    mode: "add",
                                    autorename: true,
                                    mute: false,
                                };
                                return dbx.filesUploadSessionFinish({
                                    cursor: cursor,
                                    commit: commit,
                                    contents: blob,
                                });
                            });
                        }
                    }, Promise.resolve());

                    task.then(function (result) {
                        var results = document.getElementById("results");
                        results.appendChild(document.createTextNode("File uploaded!"));
                    }).catch(function (error) {
                        console.error(error);
                    });
                }
            });
        } catch(error) {
            console.error('[cronjob:dropbox:base]', err.message);
        }
    }
};