#!/usr/bin/env python3
"""Build five original AutismHub professional practice guides in PDF and DOCX.

Reuse the established, approved AutismHub printable-form typography and layout
engine. Only templates/specs and destination change; assessment files are not
overwritten. Each working form is unfilled and contains no personal data.
"""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FORM_ENGINE = ROOT / "scripts" / "build-professional-assessment-toolkit-v2.py"
SPECS = ROOT / "scripts" / "professional-practice-tool-specs.json"
OUT = ROOT / "public" / "downloads" / "practice"

def main() -> None:
    spec = importlib.util.spec_from_file_location("autismhub_practice_form_engine", FORM_ENGINE)
    if spec is None or spec.loader is None:
        raise RuntimeError("Professional practice form generator unavailable")
    builder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(builder)
    builder.OUT = OUT
    builder.DATE = "15.10.2026"
    OUT.mkdir(parents=True, exist_ok=True)
    resources = json.loads(SPECS.read_text(encoding="utf-8"))
    expected = [
        "family-referral-pathway",
        "individual-support-plan",
        "aac-feature-matching",
        "fba-abc-observation",
        "environment-access-audit",
    ]
    assert [x["filename"] for x in resources] == expected
    created = []
    for resource in resources:
        assert len(resource["sections"]) == 4
        assert all(len(section["rows"]) >= 4 for section in resource["sections"])
        assert len(resource["references"]) >= 2
        created.extend([builder.build_pdf(resource), builder.build_docx(resource)])
    for filename in created:
        p = OUT / filename
        assert p.exists() and p.stat().st_size > 2000, filename
        print("PRACTICE_FORM_BUILT", filename, p.stat().st_size)
    print("PRACTICE_FORMS_BUILT", len(resources), "sets", len(created), "files")

if __name__ == "__main__":
    main()
