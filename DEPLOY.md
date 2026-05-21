# Deploy en Vercel

## Tipo de proyecto

Este sitio es HTML estático. No usa Next.js, React ni Vite.

La versión aprobada de la página está en:

```txt
version-inicial/
```

## Build

El comando de build es:

```sh
npm run build
```

Ese comando copia los archivos de `version-inicial/` a `dist/`, que es la carpeta que Vercel publicará.

## Subir a GitHub

Desde la terminal:

```sh
cd "/Users/hamet/Documents/New project"
git init
git add .
git commit -m "Prepare Nuevas Fuerzas site for Vercel"
git branch -M main
```

Luego crea un repositorio nuevo en GitHub, por ejemplo:

```txt
nuevas-fuerzas-site
```

No agregues README, `.gitignore` ni licencia desde GitHub, porque este proyecto ya tiene sus archivos.

Después conecta el repositorio local con GitHub:

```sh
git remote add origin https://github.com/TU_USUARIO/nuevas-fuerzas-site.git
git push -u origin main
```

Reemplaza `TU_USUARIO` por tu usuario real de GitHub.

## Importar en Vercel

1. Entra a https://vercel.com/new
2. Selecciona `Import Git Repository`.
3. Elige el repositorio `nuevas-fuerzas-site`.
4. En configuración del proyecto:
   - Framework Preset: `Other`
   - Root Directory: raíz del repositorio
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Presiona `Deploy`.

## Dominio

Después del deploy:

1. Entra al proyecto en Vercel.
2. Ve a `Settings` > `Domains`.
3. Agrega tu dominio.
4. Sigue las instrucciones DNS que Vercel muestre para tu proveedor de dominio.

## Envío de testimonios

El formulario de testimonios usa una función serverless de Vercel en `/api/testimonio`.

Para que pueda enviar correos, configura estas variables en Vercel:

```txt
RESEND_API_KEY=tu_api_key_de_resend
TESTIMONY_FROM=Nuevas Fuerzas <correo@tudominioverificado.com>
```

Los testimonios se envían a:

```txt
testimoniosnuevasfuerzas@gmail.com
```

El testimonio no se publica automáticamente en la web.
