"""
Extrae los municipios de Casanare del Marco Geoestadístico Nacional del DANE
(MGN 2018) y simplifica el contorno para que quepa en la landing.

El original son 2,8 MB con los 1.122 municipios del país a resolución completa.
Aquí solo hacen falta los 19 de Casanare, y con un trazo que se lea a nivel de
departamento y no de vereda: 9 KB.

Se guarda el resultado en el repositorio a propósito. La alternativa —pedir el
fichero al vuelo— pondría el mapa a depender de que un repositorio de terceros
siga en pie, y son datos que no cambian de un año para otro.

Uso:
    curl -sL -o mpios.geojson \
      https://raw.githubusercontent.com/caticoa3/colombia_mapa/master/co_2018_MGN_MPIO_POLITICO.geojson
    python3 scripts/extraer-casanare.py

Comprobado contra las áreas oficiales: Yopal 2.459 km² calculado frente a
2.595 reales, Paz de Ariporo 12.113 frente a 13.800. La diferencia es la
tolerancia de simplificación, no un polígono roto.
"""
import json, math, unicodedata

TOLERANCIA = 0.004  # grados (~440 m): por debajo del grosor de una línea a este zoom
DECIMALES = 4  # ~11 m. Más precisión es peso muerto.


def sin_tildes(texto):
    return ''.join(
        c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn'
    ).upper()


def distancia_a_recta(p, a, b):
    if a == b:
        return math.hypot(p[0] - a[0], p[1] - a[1])
    num = abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1]))
    return num / math.hypot(b[0] - a[0], b[1] - a[1])


def douglas_peucker(puntos, tol):
    if len(puntos) < 3:
        return puntos
    dmax, indice = 0.0, 0
    for i in range(1, len(puntos) - 1):
        d = distancia_a_recta(puntos[i], puntos[0], puntos[-1])
        if d > dmax:
            dmax, indice = d, i
    if dmax <= tol:
        return [puntos[0], puntos[-1]]
    return douglas_peucker(puntos[: indice + 1], tol)[:-1] + douglas_peucker(puntos[indice:], tol)


def simplificar_anillo(anillo):
    p = [tuple(c[:2]) for c in anillo]
    salida = douglas_peucker(p, TOLERANCIA)
    # Un anillo necesita al menos 4 puntos (el último repite el primero).
    if len(salida) < 4:
        salida = p[:: max(1, len(p) // 8)] + [p[0]]
    if salida[0] != salida[-1]:
        salida.append(salida[0])
    return [[round(x, DECIMALES), round(y, DECIMALES)] for x, y in salida]


def simplificar(geom):
    if geom['type'] == 'Polygon':
        return {'type': 'Polygon', 'coordinates': [simplificar_anillo(a) for a in geom['coordinates']]}
    if geom['type'] == 'MultiPolygon':
        return {
            'type': 'MultiPolygon',
            'coordinates': [[simplificar_anillo(a) for a in poli] for poli in geom['coordinates']],
        }
    raise ValueError(geom['type'])


origen = json.load(open('mpios.geojson'))
rasgos = []
for f in origen['features']:
    if sin_tildes(f['properties'].get('DPTO_CNMBR', '')) != 'CASANARE':
        continue
    nombre = f['properties']['MPIO_CNMBR']
    rasgos.append(
        {
            'type': 'Feature',
            # `clave` es el nombre normalizado, el mismo con el que llegan los
            # municipios del agregado: así el emparejamiento no depende de
            # tildes ni de mayúsculas.
            'properties': {'nombre': nombre.title(), 'clave': sin_tildes(nombre)},
            'geometry': simplificar(f['geometry']),
        }
    )

salida = {'type': 'FeatureCollection', 'features': sorted(rasgos, key=lambda r: r['properties']['clave'])}
texto = json.dumps(salida, ensure_ascii=False, separators=(',', ':'))
open('src/lib/data/casanare-municipios.json', 'w').write(texto)
print(f"{len(rasgos)} municipios · {len(texto) / 1024:.0f} KB")
print(', '.join(r['properties']['clave'] for r in salida['features']))
