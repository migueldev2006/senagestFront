## SENAGEST

### PASOS PARA EJECUTAR EL PROYECTO

### 1. Clonar el Repositorio

```bash
    git clone https://github.com/migueldev2006/senagestFront.git
```

### 2. Debemos acceder a la carpeta donde se encuentra nuestro frontend y ejecutar el siguiente comando para instalar las dependencias:

```bash
    npm i --force
```

### 3. Faltaria crear el archivo .env para la conexion con la api del backend para ello dejaremos un .env.example como base para que lo duplique en el .env, sien embargo a continuacion lo dejo:

```bash
    VITE_API_URL = 'http://localhost:3000/'
```

### 4. Ejecutamos nuestro proyecto; Nos dirijimos a la terminal de VS Code y ejecutamos el siguiente comando:

```bash
    npm run dev
```

### Recordatorio
Al proyecto no se le realizo la modificacion del dockerfile, por tanto al pasar a crear la imagen de docker es recomenadble revisar antes de ejecutar.

El proyecto solo se ejecuto en desarrollo.