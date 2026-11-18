#!/usr/bin/env python3
"""Simplify historical-basemaps into the 寰宇时序 atlas.

Boundaries: https://github.com/aourednik/historical-basemaps (GPL-3.0)
Coastline: Natural Earth 1:110m land (public domain)

Raw downloads stay in /tmp. This script writes world/data only.
"""
from __future__ import annotations

import json
import math
import re
import urllib.request
import zlib
from collections import defaultdict
from pathlib import Path

from shapely import affinity
from shapely.geometry import GeometryCollection, MultiPolygon, Polygon, box, shape
from shapely.ops import unary_union
from shapely.validation import make_valid

ROOT = Path(__file__).resolve().parent
RAW = Path("/tmp/wh-raw")
OUT = ROOT / "data"
BASE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/"
LAND_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson"

YEARS = [
    -3000, -1000, -500, -323, -100, 100, 400, 700, 800, 1000,
    1200, 1279, 1492, 1600, 1700, 1815, 1880, 1914, 1945, 1994, 2010,
]

PALETTE = [
    "#9c3d36", "#2c4c7c", "#1f6b5a", "#b57a2a", "#6d3d6e", "#3d6e8c",
    "#8a4b2f", "#3f6b3a", "#a33b55", "#7a6232", "#245e78", "#6e5428",
    "#7d3f2d", "#3e4a3a", "#5c4a78", "#8c5a3c", "#3f5e4a", "#7a4030",
]

COLOR_RULES = [
    (re.compile(r"manchu|qing", re.I), "#9c3d36"),
    (re.compile(r"\b(han|qin|tang|song|sui|ming|zhou|zhoa|sinic|china|sixteen kingdoms|jin|liao|xixia)\b", re.I), "#9c3d36"),
    (re.compile(r"roman|byzantine", re.I), "#6d3d6e"),
    (re.compile(r"mongol|golden horde|ilkhan|chagatai|great khanate|gokturk|göktürk|xiongnu|uyghur|khazar|timurid|kara khitai|yuan|oirat", re.I), "#8c2f2f"),
    (re.compile(r"ottoman|turkey", re.I), "#1c6b48"),
    (re.compile(r"achaemenid|parthian|sasanian|safavid|persia|persi\b|seleucid|iran|alexander", re.I), "#1f6a64"),
    (re.compile(r"umayyad|abbasid|fatimid|caliphate|mamluke|almohad|cordoba|córdoba|sokoto|hafsid|wattasid", re.I), "#1d6b45"),
    (re.compile(r"united kingdom|britain|british|england", re.I), "#9a3d4a"),
    (re.compile(r"france|frankish|carolingian|french", re.I), "#2c4c7c"),
    (re.compile(r"spain|spanish|castile|castille|aragon|habsburg|viceroyalty|navarre", re.I), "#c4892a"),
    (re.compile(r"portugal|portuguese|brazil", re.I), "#3f6b3a"),
    (re.compile(r"russia|muscovy|soviet|\bu\.?s\.?s\.?r\.?\b|novgorod|kyivan|kievan", re.I), "#2f6a3a"),
    (re.compile(r"united states|\busa\b", re.I), "#3d5f8a"),
    (re.compile(r"mughal|maurya|gupta|delhi|maratha|magadha|india\b|hindu|rajput|kushan|vijayanagara", re.I), "#b86a1e"),
    (re.compile(r"egypt|ptolemaic|mero[eë]", re.I), "#b89a4a"),
    (re.compile(r"japan|yamato", re.I), "#a33b3b"),
    (re.compile(r"german|prussia|holy roman|austria|austro", re.I), "#5c564c"),
    (re.compile(r"tibet|tufan|zhangzhung", re.I), "#7a5a3a"),
    (re.compile(r"canada", re.I), "#8a4e3a"),
    (re.compile(r"australia|new south wales|queensland", re.I), "#a06a3a"),
    (re.compile(r"sweden|denmark|norway", re.I), "#3d5f78"),
    (re.compile(r"\bmali\b|songhai|ghana|ethiopia|abyssinia", re.I), "#c47a2a"),
    (re.compile(r"aztec|mexihcah|inca|maya|quechua", re.I), "#a85a32"),
    (re.compile(r"korea|silla|koryo|goryeo", re.I), "#7a3e55"),
]

POLITY_HINT = re.compile(
    r"empire|kingdom|caliphate|sultanate|khanate|khaganate|horde|republic|dynasty|"
    r"tsardom|duchy|principality|emirate|confederacy|commonwealth|viceroyalty|"
    r"\braj\b|city-state|states|union|sultanate|\bhan\b|\bqin\b|\btang\b|\bsong\b|"
    r"\bsui\b|\bjin\b|zhou|zhoa|sinic|roman|persia|egypt|\bmali\b|songhai|"
    r"ottoman|mughal|safavid|japan|china|france|spain|portugal|russia|sweden|"
    r"denmark|england|britain|united|canada|brazil|australia|india|mexico|"
    r"argentina|turkey|iran|korea|vietnam|thailand|poland|germany|italy|greece|"
    r"morocco|ethiopia|nigeria|ussr|soviet|castille|ayutthaya|vijayanagara|"
    r"xiongnu|gokturk|göktürk|uyghur|khazar|rouran|ruanruan|tibet|tufan|"
    r"hunnic|kushan|parthian|sasanian|abbasid|umayyad|fatimid|ming|manchu|"
    r"liao|xixia|silla|champa|mali|ghana|benin|kongo|axum|aksum",
    re.I,
)
CULTURE_HINT = re.compile(
    r"hunter|gather|farmer|pastoral|nomad|tribe|culture|peoples|fisher|forag|"
    r"pottery|burial|khoisan|bantu|siberian|inuit|thule|dorset|ainu|jomon|jōmon|"
    r"saami|sámi|\bsami\b|chukchi|tungus|athabask|\bcree\b|tupi|berber|scythian|"
    r"cimerian|illyrian|aramean|vedic|dravidian|semite|austronesian|yamnaya|"
    r"afanasevo|paleo|ancestral|complex\b|samoyed|samoy",
    re.I,
)
REGION_NAMES = {
    "central Asian khanates",
    "Islamic and Hindu states",
    "minor states",
    "minor Hindu kingdoms",
    "Hindu kingdoms and republics",
}
POLITY_WORD = re.compile(r"empire|kingdom|khanate|caliphate|sultanate|horde|republic|dynasty|tsardom|viceroyalty", re.I)


def filename_for(year: int) -> str:
    return f"world_bc{-year}.geojson" if year < 0 else f"world_{year}.geojson"


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 1000:
        return
    print("download", dest.name)
    urllib.request.urlretrieve(url, dest)


def kind_of(name: str, subject: str) -> int:
    if name in REGION_NAMES:
        return 2
    polity = bool(POLITY_HINT.search(name) or POLITY_HINT.search(subject or ""))
    culture = bool(CULTURE_HINT.search(name) or CULTURE_HINT.search(subject or ""))
    if culture and not (polity and POLITY_WORD.search(name)):
        return 0
    if polity:
        return 1
    if culture:
        return 0
    return 1


def color_for(subject: str, name: str) -> str:
    text = f"{subject or ''} {name}"
    for rx, col in COLOR_RULES:
        if rx.search(text):
            return col
    return PALETTE[zlib.crc32(text.encode()) % len(PALETTE)]


def explode(geom):
    if geom is None or geom.is_empty:
        return []
    if isinstance(geom, Polygon):
        return [geom]
    if isinstance(geom, (MultiPolygon, GeometryCollection)):
        out = []
        for g in geom.geoms:
            out.extend(explode(g))
        return out
    return []


def unwrap_ring(coords):
    out = []
    shift = 0.0
    prev = None
    for x, y in coords:
        if prev is not None:
            dx = x - prev
            if dx > 180:
                shift -= 360
            elif dx < -180:
                shift += 360
        out.append((x + shift, y))
        prev = x
    return out


def split_dateline(poly: Polygon):
    minx, _, maxx, _ = poly.bounds
    if maxx - minx <= 180 and minx >= -180 and maxx <= 180:
        return [poly]
    try:
        ext = unwrap_ring(list(poly.exterior.coords))
        holes = [unwrap_ring(list(r.coords)) for r in poly.interiors]
        up = Polygon(ext, holes)
        if not up.is_valid:
            up = make_valid(up)
    except Exception:
        return [poly]
    parts = []
    bmin, _, bmax, _ = up.bounds
    k0 = math.floor((bmin + 180) / 360)
    k1 = math.floor((bmax + 180) / 360)
    for k in range(k0, k1 + 1):
        strip = box(-180 + 360 * k, -89.9, 180 + 360 * k, 89.9)
        inter = up.intersection(strip)
        if inter.is_empty:
            continue
        inter = affinity.translate(inter, xoff=-360 * k)
        parts.extend(explode(inter))
    return parts or [poly]


def quantize_ring(coords):
    ring = []
    for x, y in coords:
        p = [round(x, 2), round(y, 2)]
        if ring and ring[-1] == p:
            continue
        ring.append(p)
    if len(ring) >= 2 and ring[0] == ring[-1]:
        ring = ring[:-1]
    if len(ring) < 4:
        return None
    ring.append(ring[0])
    return ring


def geom_to_coords(geom):
    polys = []
    for poly in explode(geom):
        if poly.area < 0.04:
            continue
        outer = quantize_ring(poly.exterior.coords)
        if not outer:
            continue
        rings = [outer]
        for hole in poly.interiors:
            if Polygon(hole).area < 0.08:
                continue
            hq = quantize_ring(hole.coords)
            if hq:
                rings.append(hq)
        polys.append(rings)
    return polys


def load_year(year: int, names: dict):
    path = RAW / filename_for(year)
    download(BASE + path.name, path)
    with path.open() as f:
        data = json.load(f)
    grouped = defaultdict(list)
    meta = {}
    for ft in data["features"]:
        props = ft.get("properties") or {}
        name = props.get("NAME")
        if not name or name in ("Antarctica", "1", "true"):
            continue
        subject = props.get("SUBJECTO") or name
        if subject in ("1", "true"):
            subject = name
        try:
            geom = shape(ft["geometry"])
        except Exception:
            continue
        if geom.is_empty:
            continue
        if not geom.is_valid:
            geom = make_valid(geom)
        k = kind_of(name, subject)
        key = (name, subject, k)
        meta[key] = (name, subject, k)
        for poly in explode(geom):
            if poly.area < 0.04:
                continue
            for part in split_dateline(poly):
                if part.area >= 0.04:
                    grouped[key].append(part)
    features = []
    for key, parts in grouped.items():
        name, subject, k = meta[key]
        try:
            merged = unary_union(parts)
        except Exception:
            merged = parts[0]
        if not merged.is_valid:
            merged = make_valid(merged)
        area = abs(merged.area)
        if area < 0.12:
            continue
        tol = 0.08 if area > 180 else 0.045 if area > 30 else 0.02
        simplified = merged.simplify(tol, preserve_topology=True)
        coords = geom_to_coords(simplified)
        if not coords:
            continue
        try:
            pt = merged.representative_point()
            cx, cy = round(pt.x, 2), round(pt.y, 2)
        except Exception:
            cx = cy = 0
        minx, miny, maxx, maxy = merged.bounds
        features.append({
            "n": name,
            "s": subject,
            "k": k,
            "a": round(area, 1),
            "fill": color_for(subject, name),
            "c": [cx, cy],
            "b": [round(minx, 2), round(miny, 2), round(maxx, 2), round(maxy, 2)],
            "g": coords,
            "z": names.get(name),
        })
    features.sort(key=lambda f: -f["a"])
    return features


def load_land():
    path = RAW / "ne_50m_land.geojson"
    download(LAND_URL, path)
    with path.open() as f:
        data = json.load(f)
    coords = []
    for ft in data["features"]:
        geom = make_valid(shape(ft["geometry"]))
        geom = geom.simplify(0.04, preserve_topology=True)
        coords.extend(geom_to_coords(geom))
    return coords


def main():
    names = json.loads((ROOT / "names_zh.json").read_text())
    eras = json.loads((ROOT / "eras.json").read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "years").mkdir(exist_ok=True)
    land = load_land()
    (OUT / "land.json").write_text(json.dumps({"g": land}, separators=(",", ":")))
    print("land polys", len(land), "bytes", (OUT / "land.json").stat().st_size)

    search = {}
    for era in eras:
        year = era["year"]
        features = load_year(year, names)
        # Drop the embedded translation from the year file; the client uses names.json.
        slim = []
        for ft in features:
            z = ft.pop("z")
            slim.append(ft)
            if ft["a"] < 4 and ft["k"] != 1:
                continue
            rec = search.setdefault(ft["n"], {"n": ft["n"], "z": z, "s": ft["s"], "years": []})
            rec["years"].append(year)
            if z:
                rec["z"] = z
        payload = {"year": year, "features": slim}
        dest = OUT / "years" / f"{year}.json"
        dest.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
        states = sum(1 for ft in slim if ft["k"] == 1)
        print(f"{year:6} features {len(slim):4} states {states:4} bytes {dest.stat().st_size}")

    search_list = sorted(search.values(), key=lambda r: r["n"])
    catalog = {
        "attribution": "疆域底图：aourednik/historical-basemaps（GPL-3.0），保留更细的岸线与小邦，并加中文译名。海岸：Natural Earth 1:50m，公有领域。",
        "eras": eras,
        "search": search_list,
    }
    (OUT / "catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, separators=(",", ":")))
    (OUT / "names.json").write_text(json.dumps(names, ensure_ascii=False, separators=(",", ":")))
    print("catalog", (OUT / "catalog.json").stat().st_size, "names", len(names), "search", len(search_list))


if __name__ == "__main__":
    main()
