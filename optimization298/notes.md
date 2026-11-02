# OmniBlizz Original 2.36.6

Comparación con el código público 2.28.0: los 1.520 recursos anteriores siguen presentes; los compartidos son idénticos excepto motor y entrada. Hay 77 archivos nuevos, ninguno retirado. Esta revisión reduce trabajo innecesario; no declara resuelta toda la caída de FPS en Android.

- Accesos rápidos vacíos: no se construye el catálogo completo de la mochila cada 150 ms. Las ranuras ocupadas conservan su validación, cantidades y limpieza de referencias obsoletas.
- Consultas de aspectos, prendas y montura cósmica inactivos: se evita normalizar repetidamente estados que no participan en el fotograma.
- Sin transacción adicional del canvas para efectos de expedición cuando no hay efectos ni aura equipada.
- Se restablece el acceso nativo al DOM usado en 2.28.0: se retiran los proxies globales de style/dataset y los interceptores de atributos/clases incorporados en 2.36.2. Se conservan el límite de refresco del HUD y las cachés de imágenes.
- Se conservan todos los objetos, progresos, escenarios y recursos. No se elimina contenido de las partidas.

Validación: sintaxis, 256 comparaciones de comportamiento de consultas locales/remotas, inventario/accesos rápidos y efectos activos; 66 escenarios de simulación/HUD y 4 del cargador. Bosque e inventario Saiyan comprobados en navegador de nube. Las mediciones de CPU de este entorno no equivalen a FPS de Android. No se promete un mínimo de FPS. La causa completa de la regresión todavía requiere comparar una misma partida y escena en el dispositivo afectado.
