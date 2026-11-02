# Recursos AF301

Modo: imagegen integrado (no CLI). Se conservaron las referencias del usuario para los hologramas: aquatic-hologram.png y fire-hologram.png.

Atlas generados con alfa, cuatro columnas y ocho filas: aquatic.webp (caminar frente/espalda/derecha, chorro, salpicadura, inmersión/salto, tornado y puño); fire.webp (caminar frente/espalda/derecha, muro, llamas gemelas, rayo de dos manos, discos y roca de vuelo). La izquierda refleja las animaciones derechas. fire-punch.webp contiene cuatro fotogramas de puño propio. dna.webp es el icono de cápsula de ADN.

vfx.webp contiene 32 fotogramas de agua y fuego. Se editó con imagegen para quitar el velo del fondo y conservar alfa cero entre efectos. El juego recorta solo la llama inferior para el rastro; usa salpicadura al emerger y sitúa el chorro a la altura de la boca.

Las versiones fuente de las imágenes generadas permanecen en generated_images del entorno de creación. Los recursos de producción están en expansion301 y también en el ZIP público. La conversión PNG → WebP fue sin pérdida.

No hay objetos Image nuevos por fotograma: la tabla de recursos tiene siete entradas como máximo. Rastro máximo 8 marcas, efectos activos máximo 20 y daño por presupuesto de pulsos, independiente de FPS.
