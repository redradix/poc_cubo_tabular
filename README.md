Repo creado en unos minutos para hacer pruebas sobre diferencia de atacar al cubo tabular con queries MDX y DAX e intentar encontrar el problema de memoria al hacer queries que devuelven cantidades relativamente grandes de datos (aunque poquísimo para lo que se espera en la aplicación **Ideauto ID-Cube**).

El archivo `./xmla4js.js` contiene el código del paquete npm [xmla4js](https://www.npmjs.com/package/xmla4js) para poder modificar el código y probar a sustituirlo por el publicado en [GitHub](https://github.com/rpbouman/xmla4js), mucho más actualizado (pero que no conseguimos hacer que no lance errores)

Pruebas realizadas en la app para buscar límite de memoria:

```
pidiendo report de "Cubo Nissan"
    con 4GB asignados al proceso
        peta pidiendo miembros de Código Comercial

        matriculaciones, fecha
            bien pidiendo y expandiendo 2023, 2022, 2021, 2020, 2019 (1218 filas - 398036 bytes = ~388 KB)
            peta pidiendo y expandiendo 2022, 2021, 2020, 2019, 2018 (1354 filas - 442793 bytes = ~432 KB)

    con 8GB asignados al proceso
        peta pidiendo miembros de Código Comercial

        matriculaciones, fecha
            bien pidiendo y expandiendo 2023, 2022, 2021, 2020, 2019, 2018, 2017 (1749 filas - 571938 bytes = ~558 KB)
            peta pidiendo y expandiendo 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016 (2015 filas - 659041 bytes = ~643 KB)

    con 12GB asignados al proceso
        peta pidiendo miembros de Código Comercial

        matriculaciones, fecha
            bien pidiendo y expandiendo 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016 (2015 filas - 659041 bytes = ~643 KB)

        matriculaciones, fecha - renting
            bien con 1312 filas - 705279 bytes = ~688 KB
```
