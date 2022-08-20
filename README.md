### 📦 BackupHelper
Herramienta hecha con NodeJS para la ejecución de cronjobs para realizar backups a servicios externos.

### ⚠ WIP
Proyecto **en desarrollo!**  Aún no se han implementado las bases necesarias para su correcto funcionamiento.


### ⌚ Detalles `node cron`
Este paquete cuenta con la posibilidad de agregar un sexto parámetro que es el de "segundos" para el tiempo de ejecución.
En caso de pasar solo 5, hará caso omiso a este y funcionará como en las otras plataformas.
```
* * * * * *
^ ^ ^ ^ ^ ^
s m h d M W

s = segundos          (0-59)
m = minutos           (0-59)
h = horas             (0-23)
d = dias del mes      (1-31)
M = mes               (0-11)
W = día de la semana  (0-6)
```


### ❤ Recursos Utilizados

- [SDK Dropbox](https://github.com/dropbox/dropbox-sdk-js)
- [Node Cron](https://github.com/kelektiv/node-cron)
- [Axios](https://github.com/axios/axios)