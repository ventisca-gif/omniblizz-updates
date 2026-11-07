# OmniBlizz Original 2.36.5

- Carga inicial de imágenes limitada a seis solicitudes simultáneas, con un reintento por recurso ante un fallo de carga.
- Refresco del HUD agrupado al terminar los pasos de simulación de un fotograma.
- Simulación alineada con el renderizado para todas las razas, conservando el tiempo acumulado y los pasos máximos de 40 ms.
- Sin recursos del bosque grande en el manifiesto completo: se verificaron 1.597 archivos de la base 2.36.4.

Validación: sintaxis del motor y 70 escenarios automatizados (66 de ritmo/HUD y 4 del cargador). Inicio completo, movimiento, teléfono y mochila comprobados en navegador de nube. No se ha medido rendimiento en un dispositivo Android físico ni se garantiza un mínimo de 40 FPS.
