"""从唯一 CSV 来源生成网站数据；不修改字形或推断不支持项。"""
from pathlib import Path
import csv
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / "data/segment-character-map.csv"
with source.open(encoding="utf-8-sig", newline="") as stream:
    rows = list(csv.DictReader(stream))
glyphs = [
    {"char": row["输入"],
     "mask": int(row["共阴逻辑码"], 16) if row["共阴逻辑码"] else None,
     "alias": row["同码输入"]}
    for row in rows
]
output = ROOT / "web/js/data/glyphs.js"
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(
    "// 自动生成，来源 data/segment-character-map.csv。请运行 tools/sync_data.py 更新。\n"
    + "export const glyphs = " + json.dumps(glyphs, ensure_ascii=False, indent=4) + ";\n",
    encoding="utf-8"
)
shutil.copyfile(source, ROOT / "web/segment-character-map.csv")
print(f"Synced {len(glyphs)} glyphs")
