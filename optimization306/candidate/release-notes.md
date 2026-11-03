# OmniBlizz Original 2.40.1 · Personajes y combate de Vilgax

- Gwen con blusa roja, chaleco negro, pantalón gris y coleta; Kevin con metal azul, piedra, cristal en la cabeza y piernas de madera; Psyphon con cabeza plateada, armadura gris azulada, controles rojos y capa negra, según las referencias. Se conservan sus poses y la recogida, traslado y entrega de la insignia.
- Retira la aparición repentina de Muy Grande/Way Big sobre los personajes. Durante la fragmentación e insignia se oculta el cuerpo del jugador desde el filtro general de actores para evitar sprites residuales con otras apariencias de Piedra.
- El círculo amarillo ahora anuncia el golpe durante 1,8 segundos; fija su posición al principio. Su área de daño coincide con la elipse dibujada (125 horizontal/75 vertical), sin golpear fuera de la marca.
- Vilgax persigue más despacio y deja 1,6–1,9 segundos de recuperación tras sus ataques. Espada con dirección fijada, rayos más lentos sin perseguir al jugador después del disparo, escudo más breve y menos esquivas consecutivas. Se mantienen 800000/600000 de vida y 4000 de daño base.
- El primer asalto indica que debes resistir las destransformaciones; el asalto decisivo se gana usando Diamante AF. Se conserva el dominio temporal y el progreso guardado normal.

Validación: regresiones de guardado/desbloqueo, coincidencia del área de daño y aviso, poses de Psyphon, reconstrucción y combate con estadísticas normales. 93 comprobaciones aprobadas; prueba de combate con movimiento y daño nativos ganada en89,8 segundos de juego, sin vida infinita ni modificar la vida del jefe (regeneración normal activa). No se ha medido el rendimiento en un Android físico.
