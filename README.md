🧠 TechSolutions ERP (Frontend)

Aplicación web tipo ERP desarrollada con React + TypeScript + Vite, orientada a la gestión empresarial (usuarios, procesos y visualización de datos).

🚀 Descripción

TechSolutions ERP es una interfaz moderna que simula un sistema ERP, enfocada en la experiencia de usuario y organización de módulos empresariales.

Este proyecto representa la capa frontend de un sistema más grande, ideal para escalar hacia una arquitectura completa (API + base de datos).

🛠️ Tecnologías utilizadas
⚛️ React
🟦 TypeScript
⚡ Vite
🎨 HTML + CSS
📦 Node.js (gestión de paquetes)

📂 Estructura del proyecto
techsolutions-erp/
│
├── App.tsx          # Componente principal
├── index.tsx        # Punto de entrada
├── index.html       # HTML base
├── types.ts         # Definición de tipos
├── patterns.ts      # Lógica auxiliar / patrones
├── metadata.json    # Configuración / datos
│
├── package.json     # Dependencias
├── tsconfig.json    # Configuración TypeScript
├── vite.config.ts   # Configuración Vite

⚙️ Instalación y ejecución
1. Clonar repositorio
git clone https://github.com/santiman0408-sudo/techsolutions-erp.git
cd techsolutions-erp
2. Instalar dependencias
npm install
3. Ejecutar en entorno local
npm run dev
4. Acceder en navegador
http://localhost:5173

🌐 Variables de entorno
El proyecto incluye:
.env.local

Puedes configurar variables como:
VITE_API_URL=http://localhost:3000

🧩 Funcionalidades actuales
-Interfaz base tipo ERP
-Organización modular del frontend
-Manejo de componentes en React
-Tipado fuerte con TypeScript
